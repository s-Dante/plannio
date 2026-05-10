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
    camOff?:    boolean;
}

interface UseCallOptions {
    authUserId:  number;
    authName:    string;
    authAvatar:  string | null;
    echoChannel: any;
    groupId:     number | null;
}

// ─────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────
export function useCall({
    authUserId,
    authName,
    authAvatar,
    echoChannel,
    groupId
}: UseCallOptions) {
    const [callState,    setCallState]    = useState<CallState>('idle');
    const [callType,     setCallType]     = useState<CallType>(1);
    const [callId,       setCallId]       = useState<number | null>(null);
    const [localStream,  setLocalStream]  = useState<MediaStream | null>(null);
    const [remotePeers,  setRemotePeers]  = useState<RemotePeer[]>([]);
    const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
    const [isMuted,      setIsMuted]      = useState(false);
    const [isCamOff,     setIsCamOff]     = useState(false);

    const peerRef        = useRef<Peer | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Refs para evitar stale closures en listeners de Echo
    const callStateRef    = useRef<CallState>('idle');
    const callIdRef       = useRef<number | null>(null);
    const incomingCallRef = useRef<IncomingCallInfo | null>(null);

    useEffect(() => { callStateRef.current = callState; });
    useEffect(() => { callIdRef.current = callId; });
    useEffect(() => { incomingCallRef.current = incomingCall; });

    // Mapeo de info de participantes (peerId -> info)
    const participantInfoRef = useRef<Map<string, Omit<RemotePeer, 'stream' | 'connection'>>>(new Map());

    // Cola de llamadas PeerJS llegadas antes del stream
    const pendingPeerCallsRef = useRef<MediaConnection[]>([]);

    // ─────────────────────────────────────────────────────
    // Helpers internos
    // ─────────────────────────────────────────────────────
    const handleNewConnection = useCallback((conn: MediaConnection) => {
        conn.on('stream', (remoteStream: MediaStream) => {
            const metadata = conn.metadata || {};
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
                    userId:     info?.userId     || metadata.userId || 0,
                    peerId:     conn.peer,
                    name:       info?.name       || metadata.name || 'Usuario',
                    avatar:     info?.avatar     || metadata.avatar || null,
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
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        {
                            urls:       'turn:openrelay.metered.ca:80',
                            username:   'openrelayproject',
                            credential: 'openrelayproject',
                        },
                        {
                            urls:       'turn:openrelay.metered.ca:443',
                            username:   'openrelayproject',
                            credential: 'openrelayproject',
                        },
                        {
                            urls:       'turn:openrelay.metered.ca:443?transport=tcp',
                            username:   'openrelayproject',
                            credential: 'openrelayproject',
                        },
                    ],
                    iceTransportPolicy: 'all',
                },
            });

            peer.on('open', () => {
                peerRef.current = peer;
                resolve(peer);
            });

            peer.on('error', (err) => {
                console.error('[PeerJS]', err);
                reject(err);
            });

            peer.on('call', (call: MediaConnection) => {
                if (localStreamRef.current) {
                    call.answer(localStreamRef.current);
                    handleNewConnection(call);
                } else {
                    pendingPeerCallsRef.current.push(call);
                }
            });
        });
    }, [handleNewConnection]);

    const getLocalStream = useCallback(async (type: CallType): Promise<MediaStream> => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === 2
                ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
                : false,
        });

        localStreamRef.current = stream;
        setLocalStream(stream);

        pendingPeerCallsRef.current.forEach(call => {
            call.answer(stream);
            handleNewConnection(call);
        });
        pendingPeerCallsRef.current = [];

        return stream;
    }, [handleNewConnection]);

    const callPeer = useCallback((
        remotePeerId: string,
        stream: MediaStream,
        info: Omit<RemotePeer, 'stream' | 'connection'>
    ) => {
        if (!peerRef.current) return;

        participantInfoRef.current.set(remotePeerId, info);

        const myInfo = {
            userId: authUserId,
            peerId: peerRef.current.id,
            name:   authName,
            avatar: authAvatar,
        };

        const conn = peerRef.current.call(remotePeerId, stream, { metadata: myInfo });
        if (!conn) return;

        setRemotePeers(prev => {
            if (prev.find(p => p.peerId === remotePeerId)) return prev;
            return [...prev, { ...info, stream: null, connection: conn }];
        });

        handleNewConnection(conn);
    }, [handleNewConnection]);

    // ─────────────────────────────────────────────────────
    // Listeners de señalización Echo
    // ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!window.Echo || !authUserId) return;
        const userChannel = window.Echo.private(`user.${authUserId}`);

        const handleIncoming = (e: { callData: IncomingCallInfo }) => {
            if (e.callData.caller.id === authUserId) return;
            if (callStateRef.current !== 'idle') return;
            setIncomingCall(e.callData);
            callStateRef.current = 'ringing';
            setCallState('ringing');
        };

        userChannel.listen('.CallInitiated', handleIncoming);

        // Recuperar llamada pendiente si navegamos desde otra página
        const pendingStr = sessionStorage.getItem('pendingIncomingCall');
        if (pendingStr) {
            try {
                const pendingData = JSON.parse(pendingStr);
                handleIncoming({ callData: pendingData });

                if (sessionStorage.getItem('pendingIncomingCall_Accept') === 'true') {
                    setTimeout(() => { acceptCall(); }, 600);
                }
            } catch (_) {}
            sessionStorage.removeItem('pendingIncomingCall');
            sessionStorage.removeItem('pendingIncomingCall_Accept');
        }

        return () => {
            userChannel.stopListening('.CallInitiated');
        };
    }, [authUserId]);

    useEffect(() => {
        if (!echoChannel) return;

        echoChannel.listen('.ParticipantJoined', (e: { data: CallParticipantInfo }) => {
            if (e.data.user_id === authUserId) return;
            participantInfoRef.current.set(e.data.peer_id, {
                userId: e.data.user_id,
                peerId: e.data.peer_id,
                name:   e.data.name,
                avatar: e.data.avatar,
            });
            setRemotePeers(prev => prev.map(p =>
                p.peerId === e.data.peer_id
                    ? { ...p, userId: e.data.user_id, name: e.data.name, avatar: e.data.avatar }
                    : p
            ));
        });

        echoChannel.listen('.ParticipantLeft', (e: { data: { user_id: number } }) => {
            setRemotePeers(prev => {
                const leaving = prev.find(p => p.userId === e.data.user_id);
                leaving?.connection?.close();
                const remaining = prev.filter(p => p.userId !== e.data.user_id);

                if (remaining.length === 0 && callStateRef.current === 'in_call') {
                    setTimeout(() => hangUpInternal(true), 500);
                }
                return remaining;
            });
        });

        // Cámara apagada/encendida
        echoChannel.listen('.CameraToggled', (e: { user_id: number; cam_off: boolean }) => {
            setRemotePeers(prev => prev.map(p =>
                p.userId === e.user_id ? { ...p, camOff: e.cam_off } : p
            ));
        });

        echoChannel.listen('.CallEnded', () => {
            hangUpInternal(false);
        });

        return () => {
            echoChannel.stopListening('.ParticipantJoined');
            echoChannel.stopListening('.ParticipantLeft');
            echoChannel.stopListening('.CameraToggled');
            echoChannel.stopListening('.CallEnded');
        };
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

    const hangUpInternal = useCallback(async (notifyServer = true) => {
        if (notifyServer && callIdRef.current) {
            try {
                await axios.post(`/calls/${callIdRef.current}/leave`);
            } catch (_) { }
        }
        cleanupLocal();
        callStateRef.current = 'ended';
        setCallState('ended');
        setTimeout(() => {
            callStateRef.current = 'idle';
            setCallState('idle');
        }, 1500);
    }, []);

    const toggleMute = useCallback(() => {
        if (!localStreamRef.current) return;
        const newMuted = !isMuted;
        localStreamRef.current.getAudioTracks().forEach(t => (t.enabled = !newMuted));
        setIsMuted(newMuted);
    }, [isMuted]);

    // Apagar / encender cámara
    const toggleCamera = useCallback(async () => {
        if (!localStreamRef.current || !callIdRef.current) return;

        if (!isCamOff) {
            localStreamRef.current.getVideoTracks().forEach(t => {
                t.enabled = false;
            });
            setIsCamOff(true);
            axios.post(`/calls/${callIdRef.current}/camera-toggle`, { cam_off: true }).catch(() => {});
            setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
        } else {
            try {
                const existingTracks = localStreamRef.current.getVideoTracks();
                if (existingTracks.length > 0 && existingTracks[0].readyState === 'live') {
                    existingTracks[0].enabled = true;
                    setIsCamOff(false);
                    axios.post(`/calls/${callIdRef.current}/camera-toggle`, { cam_off: false }).catch(() => {});
                    setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
                    return;
                }

                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                });
                const [newTrack] = newStream.getVideoTracks();

                localStreamRef.current.getVideoTracks().forEach(t => {
                    t.stop();
                    localStreamRef.current!.removeTrack(t);
                });
                localStreamRef.current.addTrack(newTrack);

                setRemotePeers(prev => {
                    prev.forEach(p => {
                        if (!p.connection) return;
                        const senders = (p.connection as any).peerConnection?.getSenders?.() as RTCRtpSender[] | undefined;
                        const videoSender = senders?.find(s => s.track?.kind === 'video' || s.track === null);
                        videoSender?.replaceTrack(newTrack);
                    });
                    return prev;
                });

                setIsCamOff(false);
                axios.post(`/calls/${callIdRef.current}/camera-toggle`, { cam_off: false }).catch(() => {});
                setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
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
