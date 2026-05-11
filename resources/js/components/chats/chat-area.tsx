import React from 'react';
import { Phone, Video, Lock, Unlock, Paperclip, Smile, Users, MapPin, SendHorizonal, Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageBubble } from './message-bubble';

const styles = {
    areaBase: "flex-1 flex flex-col h-full bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0",
    bgPattern: "absolute inset-0 opacity-[0.09] dark:opacity-[0.09] dark:invert pointer-events-none bg-repeat",

    headerContainer: "h-16 border-b border-gray-200 dark:border-stone-800 flex items-center justify-between px-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10",
    headerLeftMenu: "flex items-center gap-3",
    headerAvatarGroup: "h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center overflow-hidden",
    headerAvatarIcon: "h-5 w-5",
    headerTitle: "text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight",
    headerRightMenu: "flex items-center gap-5 text-[var(--color-sisth)]/60 dark:text-gray-400",
    headerActionBtn: "hover:text-[var(--color-accent)] transition-colors cursor-pointer disabled:opacity-50 relative",
    headerIcon: "h-5 w-5",

    messagesContainer: "flex-1 overflow-y-auto p-6 space-y-4 flex flex-col relative z-0 custom-scrollbar",

    inputWrapper: "absolute bottom-5 left-6 right-6 z-10 flex flex-col gap-2",
    filePreview: "bg-white dark:bg-stone-800 p-3 rounded-2xl border border-gray-200 dark:border-stone-700 shadow-md flex items-center justify-between font-medium text-sm text-[var(--color-accent)] animate-in slide-in-from-bottom-2",

    inputBox: "flex-1 flex items-center bg-white dark:bg-stone-800 px-2 py-1 rounded-3xl shadow-md border border-gray-200 dark:border-stone-700 min-h-[50px] relative",
    inputActionBtn: "p-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors rounded-full cursor-pointer disabled:opacity-50",
    inputIcon: "h-5 w-5",
    inputIconSmile: "h-6 w-6",
    textarea: "flex-1 max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none py-3 px-2 overflow-y-auto",
    sendBtn: "bg-[var(--color-accent)] hover:bg-[#829965] text-white p-3.5 rounded-full shadow-md transition-transform active:scale-95 flex-shrink-0 flex items-center justify-center h-[50px] w-[50px] cursor-pointer disabled:opacity-50",
    sendIcon: "h-6 w-6",
};

export function ChatArea({ activeChat, auth, onMessagesUpdate, onOpenMedia, onStartCall, callState, onBack, onOpenDetails }: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [showActions, setShowActions] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const isDesktop = window.matchMedia('(pointer: fine)').matches;
        if (isDesktop && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [activeChat?.id]);

    // Comprimimos imagenes a WEBP para reducir el tamaño
    const compressImageToWebP = (file: File, maxDim = 1280, quality = 0.85): Promise<File> => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url);
                const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
                        } else {
                            resolve(file);
                        }
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = () => resolve(file);
            img.src = url;
        });
    };

    // Manejo del chat activo
    useEffect(() => {
        if (!activeChat) return;
        setLoading(true);
        axios.get(`/chats/${activeChat.id}/messages`)
            .then(res => {
                setMessages(res.data);
                scrollToBottom(false);
            })
            .catch(() => toast.error("Error cargando mensajes."))
            .finally(() => setLoading(false));
    }, [activeChat]);

    useEffect(() => {
        if (onMessagesUpdate) {
            onMessagesUpdate(messages);
        }
    }, [messages, onMessagesUpdate]);

    // Manejo de Websocket
    useEffect(() => {
        if (!activeChat || !window.Echo) return;

        const channelName = `chat.${activeChat.id}`;
        window.Echo.private(channelName)
            .listen('MessageSent', (e: any) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === e.message.id)) return prev;
                    return [...prev, e.message];
                });
                scrollToBottom(true);
            });

        return () => window.Echo.leave(channelName);
    }, [activeChat]);

    const scrollToBottom = (smooth = true) => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }, 100);
    };

    const handleSendMessage = async () => {
        if (!content.trim() && pendingFiles.length === 0) return;

        setUploading(true);
        const originalContent = content;
        setContent('');
        const filesToSend = [...pendingFiles];
        setPendingFiles([]);
        scrollToBottom();
        
        if (window.matchMedia('(pointer: fine)').matches) {
            setTimeout(() => textareaRef.current?.focus(), 50);
        }

        try {
            if (originalContent.trim()) {
                const formData = new FormData();
                formData.append('is_encrypted', isEncrypted ? '1' : '0');
                formData.append('content', originalContent);
                const res = await axios.post(`/chats/${activeChat.id}/messages`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessages(prev => prev.some(m => m.id === res.data.id) ? prev : [...prev, res.data]);
                scrollToBottom();
            }

            for (const file of filesToSend) {
                const formData = new FormData();
                formData.append('is_encrypted', isEncrypted ? '1' : '0');
                formData.append('file', file);
                const res = await axios.post(`/chats/${activeChat.id}/messages`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setMessages(prev => prev.some(m => m.id === res.data.id) ? prev : [...prev, res.data]);
                scrollToBottom();
            }
        } catch {
            toast.error('No se pudo enviar el mensaje');
            setContent(originalContent);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Límites de tamaño
        const MAX_IMAGE_MB = 10;
        const MAX_VIDEO_MB = 100;
        const MAX_FILE_MB  = 100;

        const processed: File[] = [];
        for (const file of files) {
            const mb = file.size / (1024 * 1024);

            if (file.type.startsWith('image/') && mb > MAX_IMAGE_MB) {
                toast.error(`La imagen pesa ${mb.toFixed(1)} MB. Máximo: ${MAX_IMAGE_MB} MB.`);
                continue;
            }
            if (file.type.startsWith('video/') && mb > MAX_VIDEO_MB) {
                toast.error(`El video pesa ${mb.toFixed(1)} MB. Máximo: ${MAX_VIDEO_MB} MB.`);
                continue;
            }
            if (mb > MAX_FILE_MB) {
                toast.error(`El archivo pesa ${mb.toFixed(1)} MB. Máximo: ${MAX_FILE_MB} MB.`);
                continue;
            }

            if (file.type.startsWith('image/')) {
                const compressed = await compressImageToWebP(file);
                processed.push(compressed);
            } else {
                processed.push(file);
            }
        }

        setPendingFiles(prev => [...prev, ...processed]);
        e.target.value = '';
    };

    const removePendingFile = (idx: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSendLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocalización no soportada por el navegador");
            return;
        }

        toast.info("Obteniendo ubicación...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const formData = new FormData();
                formData.append('is_encrypted', isEncrypted ? '1' : '0');
                formData.append('latitude', position.coords.latitude.toString());
                formData.append('longitude', position.coords.longitude.toString());
                formData.append('content', "📍 Ubicación compartida");

                axios.post(`/chats/${activeChat.id}/messages`, formData).then(res => {
                    setMessages(prev => prev.some(m => m.id === res.data.id) ? prev : [...prev, res.data]);
                    scrollToBottom();
                }).catch(() => toast.error("Error al enviar ubicación"));
            },
            () => toast.error("Permiso de ubicación denegado")
        );
    };

    const handleEmojiClick = (emojiData: any) => setContent(prev => prev + emojiData.emoji);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const headerOtherMember = activeChat?.is_individual
        ? activeChat.members?.find((m: any) => m.id !== auth.user.id)
        : null;
    const headerFrame = headerOtherMember?.equipped_frame ?? null;

    return (
        <div className={styles.areaBase}>
            <div className={styles.bgPattern} style={{ 
                backgroundImage: "url('/imgs/assets/fondos-chats/FondoPlannio.png')", 
                backgroundSize: '1100px',
                backgroundRepeat: 'repeat', 
                backgroundPosition: 'center' 
            }}></div>

            <div className={styles.headerContainer}>
                <div className={styles.headerLeftMenu}>
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-[var(--color-accent)] hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}

                    <button
                        onClick={onOpenDetails}
                        className="flex items-center gap-3 cursor-pointer md:cursor-default rounded-xl p-1 -ml-1 hover:bg-gray-100/60 md:hover:bg-transparent transition-colors"
                    >
                        <div className="relative flex items-center justify-center h-10 w-10 flex-shrink-0">
                            <div className={styles.headerAvatarGroup}>
                                {activeChat.avatar ?
                                    <img src={activeChat.avatar} className="w-full h-full object-cover" /> :
                                    <Users className={styles.headerAvatarIcon} />
                                }
                            </div>
                            {headerFrame && headerFrame.image_url?.startsWith('#') && (
                                <div
                                    className="absolute z-10 w-[130%] h-[130%] rounded-full border-[3px] pointer-events-none"
                                    style={{ borderColor: headerFrame.image_url }}
                                />
                            )}
                            {headerFrame && headerFrame.image_url && !headerFrame.image_url.startsWith('#') && (
                                <img
                                    src={headerFrame.image_url}
                                    className="absolute z-10 pointer-events-none object-contain"
                                    style={{ width: '140%', height: '140%', maxWidth: 'none' }}
                                    alt="Frame"
                                />
                            )}
                        </div>
                        <div>
                            <h3 className={styles.headerTitle}>{activeChat.name}</h3>
                            {activeChat.is_individual && headerOtherMember && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`h-2 w-2 rounded-full ${headerOtherMember.is_online ? 'bg-green-500' : 'bg-gray-300 dark:bg-stone-600'}`} />
                                    <span className={`text-xs font-semibold ${headerOtherMember.is_online ? 'text-green-500' : 'text-gray-400'}`}>
                                        {headerOtherMember.is_online ? 'En línea' : 'Desconectado'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </button>
                </div>
                <div className={styles.headerRightMenu}>
                    <button
                        className={`${styles.headerActionBtn} ${callState !== 'idle' ? 'text-[var(--color-accent)] opacity-50 cursor-not-allowed' : ''}`}
                        title="Llamada de voz"
                        onClick={() => callState === 'idle' && onStartCall?.(1)}
                        disabled={callState !== 'idle'}
                    >
                        <Phone className={styles.headerIcon} />
                    </button>
                    <button
                        className={`${styles.headerActionBtn} ${callState !== 'idle' ? 'text-[var(--color-accent)] opacity-50 cursor-not-allowed' : ''}`}
                        title="Videollamada"
                        onClick={() => callState === 'idle' && onStartCall?.(2)}
                        disabled={callState !== 'idle'}
                    >
                        <Video className={styles.headerIcon} />
                    </button>
                    <button
                        className={styles.headerActionBtn}
                        onClick={() => setIsEncrypted(!isEncrypted)}
                        title={isEncrypted ? "Encriptación E2E Activada" : "Sin Encriptar"}
                    >
                        {isEncrypted ? <Lock className={styles.headerIcon} /> : <Unlock className="h-5 w-5 text-gray-400" />}
                    </button>
                </div>
            </div>

            <div className={styles.messagesContainer}>
                {loading && <div className="text-center text-sm text-[var(--color-accent)] py-4 font-bold"><Loader2 className="animate-spin h-5 w-5 mx-auto" /></div>}

                {(() => {
                    const MEDIA_TYPES = [2, 3]; // IMAGE, VIDEO
                    const rendered: React.ReactNode[] = [];
                    let i = 0;

                    while (i < messages.length) {
                        const msg = messages[i];
                        const isMine = msg.user_id === auth.user.id;
                        const showName = !isMine && (!messages[i - 1] || messages[i - 1].user_id !== msg.user_id);

                        if (MEDIA_TYPES.includes(msg.type) && !msg.content) {
                            const group: any[] = [msg];
                            let j = i + 1;
                            while (
                                j < messages.length &&
                                MEDIA_TYPES.includes(messages[j].type) &&
                                !messages[j].content &&
                                messages[j].user_id === msg.user_id &&
                                Math.abs(new Date(messages[j].created_at).getTime() - new Date(msg.created_at).getTime()) < 15000
                            ) {
                                group.push(messages[j]);
                                j++;
                            }

                            rendered.push(
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isMine={isMine}
                                    showName={showName}
                                    onOpenMedia={(item) => {
                                        if (group.length > 1) {
                                            const idx = group.findIndex((g: any) => g.id === item.id);
                                            onOpenMedia({ items: group, index: idx >= 0 ? idx : 0 });
                                        } else {
                                            onOpenMedia(item);
                                        }
                                    }}
                                    groupedMedia={group.length > 1 ? group : undefined}
                                />
                            );
                            i = j;
                        } else {
                            rendered.push(
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isMine={isMine}
                                    showName={showName}
                                    onOpenMedia={onOpenMedia}
                                />
                            );
                            i++;
                        }
                    }
                    return rendered;
                })()}

                <div ref={messagesEndRef} className="h-2" />
                <div className="h-10 shrink-0" />
            </div>

            <div className={styles.inputWrapper}>

                {/* Preview de archivos adjuntos */}
                {pendingFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 px-1 animate-in slide-in-from-bottom-2">
                        {pendingFiles.map((file, idx) => {
                            const isImg = file.type.startsWith('image/');
                            const isVid = file.type.startsWith('video/');
                            return (
                                <div key={idx} className="relative group flex items-center gap-1.5 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-xl px-2 py-1.5 text-xs font-medium text-[var(--color-accent)] shadow-sm">
                                    {isImg && <span>🖼️</span>}
                                    {isVid && <span>🎬</span>}
                                    {!isImg && !isVid && <Paperclip className="h-3 w-3" />}
                                    <span className="max-w-[120px] truncate">{file.name}</span>
                                    <button
                                        onClick={() => removePendingFile(idx)}
                                        className="ml-1 text-red-400 hover:text-red-600 font-bold leading-none"
                                    >✕</button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Fila de acciones expandibles (emoji, adjuntar, ubicación) */}
                {showActions && (
                    <div className="flex items-center gap-1 px-1 animate-in slide-in-from-bottom-2 duration-150">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={styles.inputActionBtn} title="Emojis" disabled={uploading}>
                                    <Smile className="h-5 w-5" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="start" className="w-auto p-0 border-none bg-transparent shadow-none mb-2 outline-none">
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.AUTO} />
                            </PopoverContent>
                        </Popover>

                        <button className={styles.inputActionBtn} title="Adjuntar archivos" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" />

                        <button className={styles.inputActionBtn} title="Compartir Ubicación" onClick={handleSendLocation} disabled={uploading}>
                            <MapPin className="h-5 w-5" />
                        </button>
                    </div>
                )}

                <div className="flex w-full gap-2 relative">
                    <div className={styles.inputBox}>
                        {/* Botón + / × para expandir/colapsar acciones */}
                        <button
                            onClick={() => setShowActions(v => !v)}
                            disabled={uploading}
                            title={showActions ? 'Cerrar' : 'Más opciones'}
                            className={`${styles.inputActionBtn} transition-transform duration-150 ${showActions ? 'rotate-45' : 'rotate-0'}`}
                        >
                            <Plus className="h-5 w-5" />
                        </button>

                        <textarea
                            ref={textareaRef}
                            placeholder={isEncrypted ? "Escribe un mensaje seguro..." : "Escribe un mensaje..."}
                            className={styles.textarea}
                            rows={1}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ minHeight: '44px', fontSize: '16px' }}
                            disabled={uploading}
                        />
                    </div>

                    <button className={styles.sendBtn} onClick={handleSendMessage} disabled={(!content.trim() && pendingFiles.length === 0) || uploading}>
                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <SendHorizonal className={styles.sendIcon} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
