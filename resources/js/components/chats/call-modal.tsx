import { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users } from 'lucide-react';
import type { CallState, CallType, RemotePeer } from '@/hooks/use-call';

interface CallModalProps {
    callState:      CallState;
    callType:       CallType;
    localStream:    MediaStream | null;
    remotePeers:    RemotePeer[];
    isMuted:        boolean;
    isCamOff:       boolean;
    chatName:       string;
    authAvatar?:    string | null;
    onHangUp:       () => void;
    onToggleMute:   () => void;
    onToggleCamera: () => void;
}

// ─────────────────────────────────────────────────────────
// Video tile — muestra el stream de video (o avatar si no hay video)
// SIEMPRE tiene un <video> montado para que el audio fluya aunque
// el video esté desactivado.
// ─────────────────────────────────────────────────────────
function VideoTile({
    stream,
    name,
    avatar,
    isLocal = false,
    camOff  = false,
}: {
    stream:   MediaStream | null;
    name:     string;
    avatar?:  string | null;
    isLocal?: boolean;
    camOff?:  boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (stream) {
            videoRef.current.srcObject = stream;
        } else {
            videoRef.current.srcObject = null;
        }
    }, [stream]);

    // Mostrar avatar cuando: no hay stream, camOff explícito, o el único track de video
    // viene de un canvas (track negro que enviamos cuando se apaga la cámara)
    const hasRealVideo = !!stream &&
        stream.getVideoTracks().some(t =>
            t.readyState === 'live' &&
            t.enabled &&
            !t.label.toLowerCase().includes('canvas') &&
            !camOff
        );

    return (
        <div className="relative flex flex-col items-center justify-center bg-stone-800 md:rounded-2xl overflow-hidden md:aspect-video w-full h-full min-h-0">
            {/*
              <video> siempre presente:
              - Cuando hay video → muestra el stream.
              - Cuando no hay video → está oculto pero el audio
                del stream sigue reproduciéndose (muted solo para local).
            */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                className={`w-full h-full object-cover ${hasRealVideo ? '' : 'hidden'}`}
            />

            {/* Avatar cuando la cámara está apagada o no hay video */}
            {!hasRealVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-900">
                    {avatar ? (
                        <img
                            src={avatar}
                            className="h-16 w-16 rounded-full object-cover border-2 border-stone-600"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-stone-600 flex items-center justify-center">
                            <Users className="h-8 w-8 text-stone-400" />
                        </div>
                    )}
                    {camOff && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <VideoOff className="h-4 w-4 text-stone-400" />
                            <span className="text-xs text-stone-400 font-semibold">Cámara apagada</span>
                        </div>
                    )}
                </div>
            )}

            <div className="absolute bottom-2 left-3 text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full">
                {isLocal ? 'Tú' : name}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Audio tile — para llamadas de voz.
// Tiene un <audio> oculto que reproduce el stream remoto.
// ─────────────────────────────────────────────────────────
function AudioTile({
    stream,
    name,
    avatar,
    isLocal = false,
}: {
    stream:   MediaStream | null;
    name:     string;
    avatar?:  string | null;
    isLocal?: boolean;
}) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current || isLocal) return;
        audioRef.current.srcObject = stream ?? null;
    }, [stream, isLocal]);

    return (
        <div className="flex flex-col items-center gap-2">
            {/* Elemento de audio oculto — reproduce el stream remoto */}
            {!isLocal && (
                <audio ref={audioRef} autoPlay playsInline className="hidden" />
            )}

            <div className="relative">
                {avatar ? (
                    <img
                        src={avatar}
                        className="h-20 w-20 rounded-full object-cover border-4 border-stone-600 shadow-lg"
                    />
                ) : (
                    <div className="h-20 w-20 rounded-full bg-stone-700 border-4 border-stone-600 flex items-center justify-center shadow-lg">
                        <Users className="h-10 w-10 text-stone-400" />
                    </div>
                )}
                {/* Indicador de mic activo */}
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-stone-900 flex items-center justify-center">
                    <Mic className="h-2.5 w-2.5 text-white" />
                </div>
            </div>

            <span className="text-sm font-semibold text-stone-200">
                {isLocal ? 'Tú' : name}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Modal principal
// ─────────────────────────────────────────────────────────
export function CallModal({
    callState,
    callType,
    localStream,
    remotePeers,
    isMuted,
    isCamOff,
    chatName,
    authAvatar,
    onHangUp,
    onToggleMute,
    onToggleCamera,
}: CallModalProps) {
    const isVideo   = callType === 2;
    const isVisible = callState === 'initiating' || callState === 'in_call' || callState === 'ended';

    if (!isVisible) return null;

    const statusLabel = {
        initiating: 'Conectando…',
        in_call:    remotePeers.length === 0 ? 'Esperando a los demás…' : 'En llamada',
        ended:      'Llamada finalizada',
    }[callState] ?? '';

    // Grid de video: calcular columnas según participantes
    const totalVideo = remotePeers.length + 1; // +1 por mí
    const gridCols =
        totalVideo <= 1 ? 'grid-cols-1 grid-rows-1' :
        totalVideo <= 2 ? 'grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1' :
        totalVideo <= 4 ? 'grid-cols-2 grid-rows-2' :
        'grid-cols-2 md:grid-cols-3';

    return (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-4 bg-stone-900 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
                    <div>
                        <h2 className="text-lg font-bold text-white">{chatName}</h2>
                        <p className="text-sm text-stone-400">{statusLabel}</p>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
                        {isVideo
                            ? <><Video className="h-4 w-4" /> Videollamada</>
                            : <><Mic className="h-4 w-4" /> Llamada de voz</>
                        }
                    </div>
                </div>

                {/* Área de streams / avatares */}
                <div className="flex-1 md:p-6 min-h-[320px] flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                        <div className={`w-full h-full md:h-auto grid gap-1 md:gap-3 ${gridCols}`}>
                            {/* Mi propio stream */}
                            <VideoTile
                                stream={localStream}
                                name="Tú"
                                avatar={authAvatar}
                                isLocal
                                camOff={isCamOff}
                            />
                            {/* Streams remotos */}
                            {remotePeers.map(peer => (
                                <VideoTile
                                    key={peer.peerId}
                                    stream={peer.stream}
                                    name={peer.name}
                                    avatar={peer.avatar}
                                    camOff={peer.camOff}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-center gap-10 py-6">
                            {/* Mi avatar (sin audio = isLocal) */}
                            <AudioTile name="Tú" avatar={authAvatar} isLocal stream={null} />
                            {/* Participantes remotos con su stream de audio */}
                            {remotePeers.map(peer => (
                                <AudioTile
                                    key={peer.peerId}
                                    stream={peer.stream}
                                    name={peer.name}
                                    avatar={peer.avatar}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Barra de controles */}
                <div className="flex items-center justify-center gap-4 py-5 border-t border-stone-800 bg-stone-950/60">

                    {/* Mute */}
                    <button
                        onClick={onToggleMute}
                        title={isMuted ? 'Activar micrófono' : 'Silenciar'}
                        className={`p-3.5 rounded-full transition-all ${
                            isMuted
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-stone-700 text-white hover:bg-stone-600'
                        }`}
                    >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>

                    {/* Cámara — solo en videollamada */}
                    {isVideo && (
                        <button
                            onClick={onToggleCamera}
                            title={isCamOff ? 'Encender cámara' : 'Apagar cámara'}
                            className={`p-3.5 rounded-full transition-all ${
                                isCamOff
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-stone-700 text-white hover:bg-stone-600'
                            }`}
                        >
                            {isCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                        </button>
                    )}

                    {/* Colgar */}
                    <button
                        onClick={onHangUp}
                        title="Colgar"
                        className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg active:scale-95"
                    >
                        <PhoneOff className="h-6 w-6" />
                    </button>
                </div>

            </div>
        </div>
    );
}
