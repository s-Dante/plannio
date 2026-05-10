import React, { useRef, useState } from 'react';
import {
    MapPin, FileText, FileImage, FileVideo, FileAudio,
    FileArchive, FileSpreadsheet, FileCode, Play,
    Music, Download, ExternalLink,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

/** Devuelve el nombre del archivo desde una URL, limpiando hashes o ids. */
function filenameFromUrl(url: string): string {
    try {
        const parts = new URL(url, window.location.origin).pathname.split('/');
        let raw = decodeURIComponent(parts[parts.length - 1] || 'archivo');
        
        // Limpiar prefijo uniqid_ (ej. 672e811f2a3b4_reporte.xlsx -> reporte.xlsx)
        // uniqid() en PHP genera 13 caracteres, pero a veces con prefix puede variar.
        raw = raw.replace(/^[a-f0-9]{13,14}_/i, '');
        
        // Si es un hash viejo (40 caracteres alfanuméricos) + extensión
        if (/^[a-zA-Z0-9]{40}\./.test(raw)) {
            const ext = raw.split('.').pop()?.toUpperCase() || 'ARCHIVO';
            return `Documento.${ext.toLowerCase()}`;
        }
        
        return raw.length > 40 ? raw.slice(0, 37) + '...' : raw;
    } catch {
        return 'archivo';
    }
}

/** Formatea bytes en KB / MB legibles. */
function formatSize(bytes: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Ícono y color de acuerdo al mime type. */
function FileIcon({ mime, className }: { mime: string | null; className?: string }) {
    const c = className ?? 'h-8 w-8';
    if (!mime) return <FileText className={c} />;
    if (mime.startsWith('image/'))       return <FileImage className={c} />;
    if (mime.startsWith('video/'))       return <FileVideo className={c} />;
    if (mime.startsWith('audio/'))       return <FileAudio className={c} />;
    if (mime.includes('pdf'))            return <FileText className={c} />;
    if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv'))
                                         return <FileSpreadsheet className={c} />;
    if (mime.includes('zip') || mime.includes('rar') || mime.includes('tar') || mime.includes('gz'))
                                         return <FileArchive className={c} />;
    if (mime.includes('javascript') || mime.includes('json') || mime.includes('html') || mime.includes('css'))
                                         return <FileCode className={c} />;
    return <FileText className={c} />;
}

/** Etiqueta legible del tipo de archivo. */
function fileTypeLabel(mime: string | null): string {
    if (!mime) return 'Archivo';
    if (mime.includes('pdf'))            return 'PDF';
    if (mime.includes('word'))           return 'Word';
    if (mime.includes('spreadsheet') || mime.includes('excel')) return 'Excel';
    if (mime.includes('powerpoint') || mime.includes('presentation')) return 'PowerPoint';
    if (mime.includes('zip'))            return 'ZIP';
    if (mime.includes('rar'))            return 'RAR';
    if (mime.includes('tar') || mime.includes('gz')) return 'Archivo comprimido';
    if (mime.includes('javascript'))     return 'JavaScript';
    if (mime.includes('json'))           return 'JSON';
    if (mime.includes('html'))           return 'HTML';
    if (mime.startsWith('text/'))        return 'Texto';
    return 'Archivo';
}

// ─────────────────────────────────────────────────────────
// Estilos
// ─────────────────────────────────────────────────────────

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
    fileBox: "flex items-center gap-3 bg-black/10 dark:bg-white/10 p-3 rounded-xl hover:bg-black/20 transition-colors",
};

// ─────────────────────────────────────────────────────────
// Sub-componentes de media
// ─────────────────────────────────────────────────────────

/** Thumbnail de video con overlay de Play */
function VideoThumb({ src, className, onClick }: { src: string; className?: string; onClick: () => void }) {
    return (
        <div
            className={`relative cursor-pointer overflow-hidden group ${className ?? ''}`}
            onClick={onClick}
        >
            <video
                src={src}
                className="w-full h-full object-cover"
                preload="metadata"
                muted
                playsInline
            />
            {/* Overlay oscuro + botón Play */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-gray-800 ml-0.5" fill="currentColor" />
                </div>
            </div>
            {/* Badge "VIDEO" */}
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                <FileVideo className="h-2.5 w-2.5" /> VIDEO
            </div>
        </div>
    );
}

function formatAudioTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Reproductor de audio integrado con UI personalizada */
function AudioPlayer({ src, isMine }: { src: string; isMine: boolean }) {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
        } else {
            audioRef.current.play();
            setPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current || !duration) return;
        const newTime = (Number(e.target.value) / 100) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(Number(e.target.value));
    };

    return (
        <div className="flex items-center gap-3 w-full min-w-[240px]">
            <button
                onClick={toggle}
                className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${
                    isMine
                        ? 'bg-white text-[var(--color-accent)] shadow-sm'
                        : 'bg-[var(--color-accent)] text-white shadow-md'
                }`}
            >
                {playing
                    ? <span className="flex gap-0.5 items-end h-4">
                        <span className="w-1 h-3 bg-current rounded-full animate-bounce" />
                        <span className="w-1 h-4 bg-current rounded-full animate-bounce delay-75" style={{ animationDelay: '0.1s'}} />
                        <span className="w-1 h-2 bg-current rounded-full animate-bounce delay-150" style={{ animationDelay: '0.2s'}} />
                      </span>
                    : <Play className="h-4 w-4 ml-1" fill="currentColor" />
                }
            </button>

            <div className="flex-1 flex flex-col justify-center min-w-0">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1.5 focus:outline-none ${
                        isMine 
                            ? 'bg-white/30 accent-white' 
                            : 'bg-gray-200 dark:bg-stone-700 accent-[var(--color-accent)]'
                    }`}
                    style={isMine ? {
                        background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                    } : {
                        background: `linear-gradient(to right, var(--color-accent) ${progress}%, rgba(156, 163, 175, 0.3) ${progress}%)`
                    }}
                />
                <div className={`flex items-center justify-between text-[11px] font-bold tracking-wide ${isMine ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    <span className="flex items-center gap-1 opacity-80 uppercase text-[9px]">
                        <Music className="h-3 w-3" /> Nota de voz
                    </span>
                    <span className="tabular-nums opacity-90">
                        {formatAudioTime(currentTime)} / {formatAudioTime(duration)}
                    </span>
                </div>
                
                <audio
                    ref={audioRef}
                    src={src}
                    className="hidden"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    onEnded={() => setPlaying(false)}
                />
            </div>
        </div>
    );
}

/** Mini-galería cuando un mensaje tiene múltiples archivos multimedia */
function MediaGallery({ items, onOpenMedia }: { items: any[]; onOpenMedia: (m: any) => void }) {
    const count = items.length;
    const gridClass =
        count === 1 ? 'grid-cols-1' :
        count === 2 ? 'grid-cols-2' :
        count <= 4 ? 'grid-cols-2' :
        'grid-cols-3';

    // Max 9 visible, con +N overlay en el último
    const visible = items.slice(0, 9);
    const hidden  = items.length - visible.length;

    return (
        <div className={`grid gap-1 ${gridClass} ${count > 1 ? 'max-w-[280px]' : ''}`}>
            {visible.map((item, idx) => {
                const isLast = idx === visible.length - 1 && hidden > 0;
                const isImg  = item.type === 2;
                const isVid  = item.type === 3;

                return (
                    <div
                        key={item.id ?? idx}
                        className={`relative cursor-pointer overflow-hidden rounded-lg group ${count === 1 ? 'aspect-auto max-h-72' : 'aspect-square'}`}
                        onClick={() => onOpenMedia(item)}
                    >
                        {isImg && (
                            <img src={item.media_url} className="w-full h-full object-cover" alt="" />
                        )}
                        {isVid && (
                            <>
                                <video src={item.media_url} className="w-full h-full object-cover" preload="metadata" muted playsInline />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                                        <Play className="h-4 w-4 text-gray-800 ml-0.5" fill="currentColor" />
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Overlay "+N más" */}
                        {isLast && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">+{hidden + 1}</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Tipos de mensaje para grupos multimedia
// ─────────────────────────────────────────────────────────

export interface MessageGroup {
    /** Mensajes que van en la misma burbuja (multimedia del mismo usuario en <5s) */
    messages: any[];
    isMine: boolean;
    showName: boolean;
}

// ─────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────

export function MessageBubble({
    message,
    isMine,
    showName,
    onOpenMedia,
    /** Mensajes multimedia agrupados para mostrar galería */
    groupedMedia,
}: {
    message: any;
    isMine: boolean;
    showName: boolean;
    onOpenMedia: (media: any) => void;
    groupedMedia?: any[];
}) {
    const formattedTime = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1: TEXT, 2: IMAGE, 3: VIDEO, 4: AUDIO, 5: FILE, 6: LOCATION
    const renderMedia = () => {
        if (message.type === 1) return null;

        const isPure = !message.content;

        // Si hay galería agrupada, renderizarla
        if (groupedMedia && groupedMedia.length > 0 && (message.type === 2 || message.type === 3)) {
            return (
                <div className={isPure ? '' : bubbleStyles.mediaWrapper + ' !block mb-2'}>
                    <MediaGallery items={groupedMedia} onOpenMedia={onOpenMedia} />
                </div>
            );
        }

        switch (message.type) {
            case 2: // IMAGE
                return (
                    <div
                        className={(isPure ? '' : bubbleStyles.mediaWrapper) + ' cursor-pointer'}
                        onClick={() => onOpenMedia(message)}
                    >
                        <img
                            src={message.media_url}
                            alt="Imagen"
                            className={`max-w-full h-auto object-cover ${isPure ? 'max-h-80 w-full' : 'max-h-64 rounded-t-xl rounded-b-sm'}`}
                        />
                    </div>
                );

            case 3: // VIDEO — con overlay de play
                return (
                    <div className={isPure ? '' : bubbleStyles.mediaWrapper}>
                        <VideoThumb
                            src={message.media_url}
                            className={isPure ? 'max-h-80 w-full' : 'max-h-64 w-full rounded-t-xl rounded-b-sm'}
                            onClick={() => onOpenMedia(message)}
                        />
                    </div>
                );

            case 4: // AUDIO — reproductor integrado
                return (
                    <div className="w-full min-w-[220px] mb-1 mt-0.5 px-0.5">
                        <AudioPlayer src={message.media_url} isMine={isMine} />
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
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Ubicación Compartida</span>
                    </a>
                );

            default: { // FILE (5) y cualquier otro
                const fileName = filenameFromUrl(message.media_url ?? '');
                const fileSize = formatSize(message.file_size);
                const typeLabel = fileTypeLabel(message.mime_type);
                const iconColor = isMine ? 'text-white/90' : 'text-[var(--color-accent)]';

                return (
                    <a
                        href={message.media_url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${bubbleStyles.fileBox} ${isPure ? 'mb-0' : 'mb-2 mt-1'} group no-underline`}
                        download
                    >
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isMine ? 'bg-white/15' : 'bg-[var(--color-accent)]/10'}`}>
                            <FileIcon mime={message.mime_type} className={`h-5 w-5 ${iconColor}`} />
                        </div>
                        <div className="flex-1 overflow-hidden min-w-0">
                            <p className="text-sm font-bold truncate leading-tight">{fileName}</p>
                            <p className={`text-[11px] mt-0.5 ${isMine ? 'text-white/60' : 'text-gray-400 dark:text-stone-500'}`}>
                                {typeLabel}{fileSize ? ` · ${fileSize}` : ''}
                            </p>
                        </div>
                        <div className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? 'text-white/70' : 'text-gray-400'}`}>
                            <Download className="h-4 w-4" />
                        </div>
                    </a>
                );
            }
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
        <div className="flex justify-start items-end gap-2 w-full">
            {showName ? (
                <div className="w-8 shrink-0 flex flex-col items-center mb-5">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <img
                            src={message.user?.avatar || `https://ui-avatars.com/api/?name=${message.user?.name || 'U'}`}
                            className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-stone-800"
                        />
                        {message.user?.equipped_frame && (
                            message.user.equipped_frame.image_url?.startsWith('#') ? (
                                <div
                                    className="absolute z-10 w-[130%] h-[130%] rounded-full border-[3px] pointer-events-none"
                                    style={{ borderColor: message.user.equipped_frame.image_url }}
                                />
                            ) : (
                                <img
                                    src={message.user.equipped_frame.image_url}
                                    className="absolute z-10 pointer-events-none object-contain"
                                    style={{ width: '140%', height: '140%', maxWidth: 'none' }}
                                />
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-8 shrink-0" />
            )}

            <div className={bubbleStyles.rowStart + " max-w-[calc(75%-2.5rem)]"}>
                <div className={isPureMedia ? bubbleStyles.bubbleMediaOnlyReceived : bubbleStyles.bubbleReceived + " !max-w-full"}>
                    {showName && !isPureMedia && (
                        <div className="text-xs font-bold text-[var(--color-accent)] mb-1 pb-1 border-b border-gray-100 dark:border-stone-700/50 flex items-center gap-1">
                            {message.user?.name}
                            {message.user?.equipped_badges?.length > 0 && (
                                <div className="flex gap-0.5 ml-1">
                                    {message.user.equipped_badges.map((b: any) => (
                                        b.image_url?.startsWith('http') ?
                                        <img key={b.id} src={b.image_url} className="h-3 w-3 object-contain" title={b.name} /> :
                                        <div key={b.id} className="h-3 w-3 rounded-full flex items-center justify-center text-[6px] text-white" style={{ backgroundColor: b.image_url || '#ccc' }} title={b.name}>★</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {renderMedia()}
                    {message.content && <p className={bubbleStyles.text}>{message.content}</p>}
                </div>
                <div className={bubbleStyles.metaReceived}>{formattedTime}</div>
            </div>
        </div>
    );
}
