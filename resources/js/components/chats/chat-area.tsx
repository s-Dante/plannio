import { Phone, Video, Lock, Unlock, Paperclip, Smile, Users, MapPin, SendHorizonal, Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageBubble } from './message-bubble';

const styles = {
    areaBase: "flex-1 flex flex-col h-full bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0",
    bgPattern: "absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",

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
    textarea: "flex-1 max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none py-3 px-2 overflow-y-auto",
    sendBtn: "bg-[var(--color-accent)] hover:bg-[#829965] text-white p-3.5 rounded-full shadow-md transition-transform active:scale-95 flex-shrink-0 flex items-center justify-center h-[50px] w-[50px] cursor-pointer disabled:opacity-50",
    sendIcon: "h-6 w-6",
};

export function ChatArea({ activeChat, auth, onMessagesUpdate, onOpenMedia, onStartCall, callState, onBack, onOpenDetails }: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [showActions, setShowActions] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Sincronizar mensajes hacia Index.tsx para que ChatDetails pueda leerlos
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

    const handleSendMessage = () => {
        if (!content.trim() && !pendingFile) return;

        setUploading(true);
        const optimisticId = Math.random();

        const formData = new FormData();
        formData.append('is_encrypted', isEncrypted ? '1' : '0');
        if (content.trim()) formData.append('content', content);
        if (pendingFile) formData.append('file', pendingFile);

        const originalContent = content;
        setContent('');
        setPendingFile(null);
        scrollToBottom();

        axios.post(`/chats/${activeChat.id}/messages`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            setMessages(prev => {
                if (prev.some(m => m.id === res.data.id)) return prev;
                return [...prev, res.data];
            });
            scrollToBottom();
        }).catch(() => {
            toast.error("No se pudo enviar el mensaje");
            setContent(originalContent);
        }).finally(() => {
            setUploading(false);
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setPendingFile(e.target.files[0]);
        }
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
            <div className={styles.bgPattern}></div>

            <div className={styles.headerContainer}>
                <div className={styles.headerLeftMenu}>
                    {/* Botón back — solo mobile */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 -ml-2 rounded-xl text-gray-500 hover:text-[var(--color-accent)] hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Avatar + nombre — clickeable para abrir detalles en mobile */}
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

                {messages.map((msg: any, idx: number) => {
                    const isMine = msg.user_id === auth.user.id;
                    const showName = !isMine && (!messages[idx - 1] || messages[idx - 1].user_id !== msg.user_id);
                    return <MessageBubble key={msg.id} message={msg} isMine={isMine} showName={showName} onOpenMedia={onOpenMedia} />;
                })}

                <div ref={messagesEndRef} className="h-2"></div>
                <div className="h-10 shrink-0"></div>
            </div>

            <div className={styles.inputWrapper}>

                {/* Preview de archivo adjunto */}
                {pendingFile && (
                    <div className={styles.filePreview}>
                        <div className="flex items-center gap-2 truncate">
                            <Paperclip className="h-4 w-4" />
                            <span className="truncate max-w-[200px]">{pendingFile.name}</span>
                        </div>
                        <button onClick={() => setPendingFile(null)} className="text-red-500 hover:text-red-700">✕</button>
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

                        <button className={styles.inputActionBtn} title="Adjuntar Documento" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            <Paperclip className="h-5 w-5" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

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
                            placeholder={isEncrypted ? "Escribe un mensaje seguro..." : "Escribe un mensaje..."}
                            className={styles.textarea}
                            rows={1}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ minHeight: '44px' }}
                            disabled={uploading}
                        />
                    </div>

                    <button className={styles.sendBtn} onClick={handleSendMessage} disabled={(!content.trim() && !pendingFile) || uploading}>
                        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <SendHorizonal className={styles.sendIcon} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
