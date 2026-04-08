import React from 'react';
import { MapPin, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';

const bubbleStyles = {
    rowStart: "flex justify-start flex-col items-start gap-1 w-full",
    rowEnd: "flex justify-end flex-col items-end gap-1 w-full",

    bubbleReceived: "relative bg-white dark:bg-stone-800 text-gray-800 dark:text-gray-200 p-3 px-4 rounded-2xl rounded-bl-none max-w-[75%] shadow-sm border border-gray-100 dark:border-stone-700/60 break-words",
    bubbleSent: "relative bg-[var(--color-accent)] text-white p-3 px-4 rounded-2xl rounded-br-none max-w-[75%] shadow-sm break-words",
    
    bubbleMediaOnly: "relative max-w-[75%] rounded-2xl rounded-br-none overflow-hidden border border-gray-200 dark:border-stone-800",
    bubbleMediaOnlyReceived: "relative max-w-[75%] rounded-2xl rounded-bl-none overflow-hidden border border-gray-200 dark:border-stone-800",

    text: "text-[14px] leading-relaxed font-medium whitespace-pre-wrap break-words",

    metaReceived: "text-[10px] font-bold text-gray-400 pl-1 mt-0.5",
    metaSent: "text-[10px] font-bold text-gray-400/80 pr-1 mt-0.5",
    
    mediaWrapper: "flex items-center justify-center m-[-12px] mb-2 overflow-hidden",
    fileBox: "flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-xl hover:bg-black/20 transition-colors cursor-pointer",
};

export function MessageBubble({ message, isMine, showName }: { message: any, isMine: boolean, showName: boolean }) {
    
    const formattedTime = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Enums based mapping from MessageTypeEnum
    // 1: TEXT, 2: IMAGE, 3: VIDEO, 4: AUDIO, 5: FILE, 6: LOCATION

    const renderMedia = () => {
        if (message.type === 1) return null;

        // If it's pure media without caption, let's just return the blob strictly
        const isPure = !message.content;

        switch (message.type) {
            case 2: // IMAGE
                return (
                    <div className={isPure ? "" : bubbleStyles.mediaWrapper}>
                        <img src={message.media_url} alt="Image" className={`max-w-full h-auto object-cover ${isPure ? 'max-h-80 w-full' : 'max-h-64 rounded-t-xl rounded-b-sm'}`} />
                    </div>
                );
            case 3: // VIDEO
                return (
                    <div className={isPure ? "" : bubbleStyles.mediaWrapper}>
                        <video src={message.media_url} controls className={`max-w-full h-auto bg-black ${isPure ? 'max-h-80 w-full' : 'max-h-64 rounded-b-sm'}`}></video>
                    </div>
                );
            case 4: // AUDIO
                return (
                    <div className="w-full min-w-[200px] mb-2 mt-1">
                        <audio src={message.media_url} controls className="w-full h-10"></audio>
                    </div>
                );
            case 6: // LOCATION
                return (
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${message.latitude},${message.longitude}`} 
                        target="_blank" rel="noreferrer"
                        className={`flex flex-col items-center justify-center w-full aspect-video bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-blue-100 dark:border-blue-900/30 overflow-hidden group cursor-pointer ${isPure ? '' : 'rounded-lg border mb-2 mt-1 p-4'}`}
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <MapPin className="h-6 w-6 text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-medium">Ubicación Compartida</span>
                    </a>
                );
            default: // FILE (5)
                return (
                    <a href={message.media_url} target="_blank" rel="noreferrer" className={bubbleStyles.fileBox + (isPure ? " mb-0" : " mb-2 mt-1")}>
                        <FileText className="h-8 w-8 opacity-80" />
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate">Archivo Adjunto</p>
                            <p className="text-xs opacity-70">Descargar documento</p>
                        </div>
                    </a>
                );
        }
    };

    const isPureMedia = !message.content && [2, 3, 6].includes(message.type);

    if (isMine) {
        return (
            <div className={bubbleStyles.rowEnd}>
                <div className={isPureMedia ? bubbleStyles.bubbleMediaOnly : bubbleStyles.bubbleSent}>
                    {renderMedia()}
                    {message.content && <p className={bubbleStyles.text + (message.type !== 1 ? ' mt-1' : '')}>{message.content}</p>}
                </div>
                <div className={bubbleStyles.metaSent}>{formattedTime}</div>
            </div>
        );
    }

    return (
        <div className={bubbleStyles.rowStart}>
            <div className={isPureMedia ? bubbleStyles.bubbleMediaOnlyReceived : bubbleStyles.bubbleReceived}>
                {showName && !isPureMedia && (
                    <div className="text-xs font-bold text-[var(--color-accent)] mb-1 pb-1 border-b border-gray-100 dark:border-stone-700/50">
                        {message.user?.name}
                    </div>
                )}

                {renderMedia()}

                {message.content && <p className={bubbleStyles.text}>{message.content}</p>}
            </div>
            <div className={bubbleStyles.metaReceived}>{showName && isPureMedia ? message.user?.name + " • " : ""}{formattedTime}</div>
        </div>
    );
}
