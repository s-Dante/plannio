import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import axios from 'axios';

// ─────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────

export type CallState = 'idle' | 'initiating' | 'ringing' | 'in_call' | 'ended';
export type CallType  = 1 | 2; // 1 = voz, 2 = video

export interface CallParticipantInfo {
    user_id: number;
    peer_id: string;
    name:    string;
    avatar:  string | null;
}

export interface IncomingCallInfo {
    call_id:  number;
    group_id: number;
    type:     CallType;
    caller: {
        id:     number;
        name:   string;
        avatar: string | null;
    };
    peer_id: string;
}

export interface RemotePeer {
    userId:     number;
    peerId:     string;
    name:       string;
    avatar:     string | null;
    stream:     MediaStream | null;
    connection: MediaConnection | null;
}

interface UseCallOptions {
    authUserId:  number;
    echoChannel: any;
    groupId:     number | null;
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────

export function useCall({ authUserId, echoChannel, groupId }: UseCallOptions) {
    const [callState,   setCallState]   = useState<CallState>('idle');
    const [callType,    setCallType]    = useState<CallType>(1);
    const [callId,      setCallId]      = useState<number | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
    const [incomingCall,setIncomingCall]= useState<IncomingCallInfo | null>(null);
    const [isMuted,     setIsMuted]     = useState(false);
    const [isCamOff,    setIsCamOff]    = useState(false);

    const peerRef          = useRef<Peer | null>(null);
    const localStreamRef   = useRef<MediaStream | null>(null);

    // ── Refs para evitar stale closures en listeners de Echo ──
    // Se sincronizan con el estado en cada render sin re-suscribir eventos.
    const callStateRef    = useRef<CallState>('idle');
    const callIdRef       = useRef<number | null>(null);
    const incomingCallRef = useRef<IncomingCallInfo | null>(null);

    useEffect(() => { callStateRef.current = callState; });
    useEffect(() => { callIdRef.current = callId; });
    useEffect(() => { incomingCallRef.current = incomingCall; });

    // ── Mapa de info de participantes (peerId → info) ──────
    // Permite que peer.on('call') conozca el nombre/avatar
    // del participante que llama sin necesitar pasar props.
    const participantInfoRef = useRef<Map<string, Omit<RemotePeer, 'stream' | 'connection'>>>(new Map());

    // ── Cola de llamadas PeerJS llegadas antes del stream ──
    const pendingPeerCallsRef = useRef<MediaConnection[]>([]);

    // ─────────────────────────────────────────────────────
    // Helpers internos
    // ─────────────────────────────────────────────────────

    /** Conectar y configurar una MediaConnection (recibida o iniciada) */
    const handleNewConnection = useCallback((conn: MediaConnection) => {
        conn.on('stream', (remoteStream: MediaStream) => {
            const info = participantInfoRef.current.get(conn.peer);
            setRemotePeers(prev => {
                const exists = prev.find(p => p.peerId === conn.peer);
                if (exists) {
                    return prev.map(p =>
                        p.peerId === conn.peer
                            ? { ...p, stream: remoteStream, connection: conn }
                            : p
                    );
                }
                return [...prev, {
                    userId:     info?.userId     ?? 0,
                    peerId:     conn.peer,
                    name:       info?.name       ?? 'Usuario',
                    avatar:     info?.avatar     ?? null,
                    stream:     remoteStream,
                    connection: conn,
                }];
            });
        });

        conn.on('close', () => {
            setRemotePeers(prev => prev.filter(p => p.peerId !== conn.peer));
        });

        conn.on('error', () => {
            setRemotePeers(prev => prev.filter(p => p.peerId !== conn.peer));
        });
    }, []);

    /** Inicializar el Peer de PeerJS. Solo se crea una vez. */
    const initPeer = useCallback((): Promise<Peer> => {
        return new Promise((resolve, reject) => {
            if (peerRef.current && !peerRef.current.destroyed) {
                resolve(peerRef.current);
                return;
            }

            const peer = new Peer({
                host:   '0.peerjs.com',
                port:   443,
                secure: true,
                path:   '/',
                debug:  0,
            });

            peer.on('open', () => {
                peerRef.current = peer;
                resolve(peer);
            });

            peer.on('error', (err) => {
                console.error('[PeerJS]', err);
                reject(err);
            });

            // Responder llamadas entrantes de PeerJS.
            // En mesh topology, el recién llegado LLAMA a los existentes,
            // los existentes solo RESPONDEN aquí.
            peer.on('call', (call: MediaConnection) => {
                if (localStreamRef.current) {
                    call.answer(localStreamRef.current);
                    handleNewConnection(call);
                } else {
                    // Stream aún no disponible → encolar para responder después
                    pendingPeerCallsRef.current.push(call);
                }
            });
        });
    }, [handleNewConnection]);

    /** Obtener micrófono y (opcionalmente) cámara. Responde las llamadas en cola. */
    const getLocalStream = useCallback(async (type: CallType): Promise<MediaStream> => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === 2
                ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
                : false,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Responder llamadas que llegaron antes de tener el stream
        pendingPeerCallsRef.current.forEach(call => {
            call.answer(stream);
            handleNewConnection(call);
        });
        pendingPeerCallsRef.current = [];

        return stream;
    }, [handleNewConnection]);

    /** Llamar activamente a un peer remoto (lo usa el nuevo joiner). */
    const callPeer = useCallback((
        remotePeerId: string,
        stream: MediaStream,
        info: Omit<RemotePeer, 'stream' | 'connection'>
    ) => {
        if (!peerRef.current) return;

        // Guardar info para que handleNewConnection la use al recibir el stream
        participantInfoRef.current.set(remotePeerId, info);

        const conn = peerRef.current.call(remotePeerId, stream);
        if (!conn) return;

        // Mostrar el peer en UI inmediatamente (sin stream todavía)
        setRemotePeers(prev => {
            if (prev.find(p => p.peerId === remotePeerId)) return prev;
            return [...prev, { ...info, stream: null, connection: conn }];
        });

        handleNewConnection(conn);
    }, [handleNewConnection]);

    // ─────────────────────────────────────────────────────
    // Listeners de señalización Echo
    // Solo dependen de `echoChannel` y `authUserId`.
    // Usan *refs* para leer estado actual sin causar re-suscripciones.
    // ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!echoChannel) return;

        // ── Llamada iniciada por alguien del grupo ─────────
        echoChannel.listen('.CallInitiated', (e: { callData: IncomingCallInfo }) => {
            if (e.callData.caller.id === authUserId) return;       // soy yo el caller
            if (callStateRef.current !== 'idle') return;           // ya estoy en llamada
            setIncomingCall(e.callData);
            callStateRef.current = 'ringing';
            setCallState('ringing');
        });

        // ── Nuevo participante se unió ─────────────────────
        // SOLO guardamos su info. La conexión P2P la establece
        // EL NUEVO al llamar a los existentes (peer.on('call')).
        echoChannel.listen('.ParticipantJoined', (e: { data: CallParticipantInfo }) => {
            if (e.data.user_id === authUserId) return;
            // Guardar info para que handleNewConnection la use cuando el peer llame
            participantInfoRef.current.set(e.data.peer_id, {
                userId: e.data.user_id,
                peerId: e.data.peer_id,
                name:   e.data.name,
                avatar: e.data.avatar,
            });
            // Si ya tenemos su stream en remotePeers (llegó antes que el evento),
            // actualizar el nombre/avatar
            setRemotePeers(prev => prev.map(p =>
                p.peerId === e.data.peer_id
                    ? { ...p, userId: e.data.user_id, name: e.data.name, avatar: e.data.avatar }
                    : p
            ));
        });

        // ── Participante salió ─────────────────────────────
        echoChannel.listen('.ParticipantLeft', (e: { data: { user_id: number } }) => {
            setRemotePeers(prev => {
                const leaving = prev.find(p => p.userId === e.data.user_id);
                leaving?.connection?.close();
                return prev.filter(p => p.userId !== e.data.user_id);
            });
        });

        // ── Llamada terminada ──────────────────────────────
        echoChannel.listen('.CallEnded', () => {
            hangUpInternal(false);
        });

        return () => {
            echoChannel.stopListening('.CallInitiated');
            echoChannel.stopListening('.ParticipantJoined');
            echoChannel.stopListening('.ParticipantLeft');
            echoChannel.stopListening('.CallEnded');
        };
        // ↑ Solo re-suscribir cuando cambia el canal o el usuario.
        //   El estado se lee via refs para evitar stale closures.
    }, [echoChannel, authUserId]);

    // ─────────────────────────────────────────────────────
    // Acciones públicas
    // ─────────────────────────────────────────────────────

    const startCall = useCallback(async (type: CallType) => {
        if (!groupId) return;
        setCallType(type);
        callStateRef.current = 'initiating';
        setCallState('initiating');

        try {
            const peer   = await initPeer();
            const stream = await getLocalStream(type);

            const res = await axios.post('/calls/initiate', {
                group_id: groupId,
                type,
                peer_id:  peer.id,
            });

            const { call, participants } = res.data;
            setCallId(call.id);
            callStateRef.current = 'in_call';
            setCallState('in_call');

            // Si había una llamada activa con participantes, unirse a ellos
            for (const p of (participants as CallParticipantInfo[])) {
                if (p.user_id !== authUserId) {
                    callPeer(p.peer_id, stream, {
                        userId: p.user_id,
                        peerId: p.peer_id,
                        name:   p.name,
                        avatar: p.avatar,
                    });
                }
            }
        } catch (err) {
            console.error('[useCall] startCall error', err);
            cleanupLocal();
            callStateRef.current = 'idle';
            setCallState('idle');
        }
    }, [groupId, authUserId, initPeer, getLocalStream, callPeer]);

    const acceptCall = useCallback(async () => {
        const call = incomingCallRef.current;
        if (!call) return;

        const { call_id, type, peer_id: callerPeerId, caller } = call;

        setCallType(type);
        callStateRef.current = 'initiating';
        setCallState('initiating');
        setIncomingCall(null);

        try {
            const peer   = await initPeer();
            const stream = await getLocalStream(type);

            const res = await axios.post(`/calls/${call_id}/join`, {
                peer_id: peer.id,
            });

            const { participants } = res.data;
            setCallId(call_id);
            callStateRef.current = 'in_call';
            setCallState('in_call');

            // El nuevo participante (yo) llama a TODOS los existentes:
            // el caller original + cualquier otro que ya esté en la llamada
            const existingPeers: CallParticipantInfo[] = [
                { user_id: caller.id, peer_id: callerPeerId, name: caller.name, avatar: caller.avatar },
                ...(participants as CallParticipantInfo[]).filter(p => p.user_id !== authUserId),
            ];

            for (const p of existingPeers) {
                if (p.peer_id) {
                    callPeer(p.peer_id, stream, {
                        userId: p.user_id,
                        peerId: p.peer_id,
                        name:   p.name,
                        avatar: p.avatar,
                    });
                }
            }
        } catch (err) {
            console.error('[useCall] acceptCall error', err);
            cleanupLocal();
            callStateRef.current = 'idle';
            setCallState('idle');
        }
    }, [authUserId, initPeer, getLocalStream, callPeer]);

    const rejectCall = useCallback(() => {
        setIncomingCall(null);
        callStateRef.current = 'idle';
        setCallState('idle');
    }, []);

    /** Colgar. notifyServer=false cuando el servidor ya terminó la llamada. */
    const hangUpInternal = useCallback(async (notifyServer = true) => {
        if (notifyServer && callIdRef.current) {
            try {
                await axios.post(`/calls/${callIdRef.current}/leave`);
            } catch (_) { /* silencio */ }
        }
        cleanupLocal();
        callStateRef.current = 'ended';
        setCallState('ended');
        setTimeout(() => {
            callStateRef.current = 'idle';
            setCallState('idle');
        }, 1500);
    }, []);

    /** Silenciar / reactivar micrófono. No para el hardware. */
    const toggleMute = useCallback(() => {
        if (!localStreamRef.current) return;
        const newMuted = !isMuted;
        localStreamRef.current.getAudioTracks().forEach(t => (t.enabled = !newMuted));
        setIsMuted(newMuted);
    }, [isMuted]);

    /**
     * Apagar / encender cámara.
     * Para realmente apagar el LED: stop() el track.
     * Para encender: solicitar nuevo track y reemplazarlo en todas las conexiones.
     */
    const toggleCamera = useCallback(async () => {
        if (!localStreamRef.current) return;

        if (!isCamOff) {
            // ── Apagar cámara: detener el track (LED se apaga)
            localStreamRef.current.getVideoTracks().forEach(t => {
                t.stop();
                localStreamRef.current!.removeTrack(t);
            });
            setIsCamOff(true);

            // Notificar a los peers que no habrá video (reemplazar con track vacío)
            setRemotePeers(prev => {
                prev.forEach(p => {
                    if (!p.connection) return;
                    const senders = (p.connection as any).peerConnection?.getSenders?.() as RTCRtpSender[] | undefined;
                    const videoSender = senders?.find(s => s.track?.kind === 'video');
                    if (videoSender) videoSender.replaceTrack(null);
                });
                return prev;
            });
        } else {
            // ── Encender cámara: obtener nuevo track
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                });
                const [newTrack] = newStream.getVideoTracks();
                localStreamRef.current.addTrack(newTrack);

                // Reemplazar track en todas las conexiones activas
                setRemotePeers(prev => {
                    prev.forEach(p => {
                        if (!p.connection) return;
                        const senders = (p.connection as any).peerConnection?.getSenders?.() as RTCRtpSender[] | undefined;
                        const videoSender = senders?.find(s => s.track === null || s.track?.kind === 'video');
                        if (videoSender) videoSender.replaceTrack(newTrack);
                    });
                    return prev;
                });

                // Actualizar el stream local para que el video tile local lo muestre
                setLocalStream(new MediaStream([
                    ...localStreamRef.current.getAudioTracks(),
                    newTrack,
                ]));
                setIsCamOff(false);
            } catch (err) {
                console.error('[useCall] No se pudo reactivar la cámara', err);
            }
        }
    }, [isCamOff]);

    // ─────────────────────────────────────────────────────
    // Cleanup
    // ─────────────────────────────────────────────────────

    const cleanupLocal = useCallback(() => {
        setRemotePeers(prev => {
            prev.forEach(p => p.connection?.close());
            return [];
        });
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(t => t.stop());
            localStreamRef.current = null;
        }
        setLocalStream(null);
        setCallId(null);
        setIsMuted(false);
        setIsCamOff(false);
        participantInfoRef.current.clear();
        pendingPeerCallsRef.current = [];
    }, []);

    useEffect(() => {
        return () => {
            cleanupLocal();
            peerRef.current?.destroy();
        };
    }, []);

    return {
        callState,
        callType,
        callId,
        localStream,
        remotePeers,
        incomingCall,
        isMuted,
        isCamOff,
        startCall,
        acceptCall,
        rejectCall,
        hangUp: hangUpInternal,
        toggleMute,
        toggleCamera,
    };
}
