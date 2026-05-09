import { Phone, Video, PhoneOff, Users } from 'lucide-react';
import type { IncomingCallInfo } from '@/hooks/use-call';

interface IncomingCallNotificationProps {
    call:     IncomingCallInfo | null;
    onAccept: () => void;
    onReject: () => void;
}

export function IncomingCallNotification({ call, onAccept, onReject }: IncomingCallNotificationProps) {
    if (!call) return null;

    const isVideo = call.type === 2;

    return (
        <div className="fixed top-6 right-6 z-[9999] w-80 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4">
                    {/* Header: tipo de llamada */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 mb-3">
                        {isVideo
                            ? <><Video className="h-3.5 w-3.5 text-blue-400" /><span className="text-blue-400">Videollamada entrante</span></>
                            : <><Phone className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Llamada de voz entrante</span></>
                        }
                    </div>

                    {/* Info del caller */}
                    <div className="flex items-center gap-3 mb-4">
                        {call.caller.avatar ? (
                            <img
                                src={call.caller.avatar}
                                className="h-12 w-12 rounded-full object-cover border-2 border-stone-600 flex-shrink-0"
                                alt={call.caller.name}
                            />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-stone-700 border-2 border-stone-600 flex items-center justify-center flex-shrink-0">
                                <Users className="h-6 w-6 text-stone-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{call.caller.name}</p>
                            <p className="text-xs text-stone-400">
                                {isVideo ? 'Quiere iniciar una videollamada' : 'Quiere iniciar una llamada'}
                            </p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            onClick={onReject}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-sm py-2.5 rounded-xl transition-colors border border-red-600/30"
                        >
                            <PhoneOff className="h-4 w-4" /> Rechazar
                        </button>
                        <button
                            onClick={onAccept}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-white font-bold text-sm py-2.5 rounded-xl transition-colors ${
                                isVideo
                                    ? 'bg-blue-600 hover:bg-blue-500'
                                    : 'bg-green-600 hover:bg-green-500'
                            }`}
                        >
                            {isVideo ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
