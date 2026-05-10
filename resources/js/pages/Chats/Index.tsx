import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChatSidebar } from '@/components/chats/chat-sidebar';
import { ChatArea } from '@/components/chats/chat-area';
import { ChatDetails } from '@/components/chats/chat-details';
import { SearchUsersModal } from '@/components/chats/search-users-modal';
import { CreateGroupModal } from '@/components/chats/create-group-modal';
import { CallModal } from '@/components/chats/call-modal';
import { IncomingCallNotification } from '@/components/chats/incoming-call-notification';
import { useEffect, useState } from 'react';
import { useCall } from '@/hooks/use-call';
import { toast } from 'sonner';
import { MessageCircle, X } from 'lucide-react';

// Panel visible en mobile: 'list' | 'chat' | 'details'
type MobilePanel = 'list' | 'chat' | 'details';

const breadcrumbs = [{ title: 'Chats', href: '/chats' }];

export default function ChatsIndex() {
    const { groups, pendingRequests, friends, auth } = usePage<any>().props;
    const [isSearchOpen,      setIsSearchOpen]      = useState(false);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [activeChat,        setActiveChat]        = useState<any>(null);
    const [chatMessages,      setChatMessages]      = useState<any[]>([]);
    const [lightboxMedia,      setLightboxMedia]      = useState<any>(null);
    // Panel activo en mobile
    const [mobilePanel,       setMobilePanel]       = useState<MobilePanel>('list');
    // Canal de Echo del chat activo — como state para que el hook reaccione al cambio
    const [activeChatChannel,  setActiveChatChannel]  = useState<any>(null);
    // Lista de grupos ordenada por último mensaje (actualizada optimisticamente)
    const [localGroups,        setLocalGroups]        = useState<any[]>(groups || []);

    // Burbujear un chat al tope cuando llega un nuevo mensaje
    const bumpGroupToTop = (groupId: number) => {
        setLocalGroups(prev => {
            const idx = prev.findIndex((g: any) => g.id === groupId);
            if (idx <= 0) return prev; // ya está primero
            const updated = [...prev];
            const [group] = updated.splice(idx, 1);
            return [group, ...updated];
        });
    };

    // ── Hook de llamadas ──────────────────────────────────
    const {
        callState,
        callType,
        localStream,
        remotePeers,
        incomingCall,
        isMuted,
        isCamOff,
        startCall,
        acceptCall,
        rejectCall,
        hangUp,
        toggleMute,
        toggleCamera,
    } = useCall({
        authUserId:  auth.user.id,
        authName:    auth.user.name + ' ' + auth.user.father_lastname,
        authAvatar:  auth.user.avatar,
        echoChannel: activeChatChannel,
        groupId:     activeChat?.id ?? null,
    });

    // Sincronizar localGroups cuando cambian los grupos desde el servidor
    useEffect(() => {
        setLocalGroups(groups || []);
    }, [groups]);

    // Actualizar el chat activo cuando cambian los grupos (tras reload)
    useEffect(() => {
        if (activeChat && groups) {
            const updatedChat = groups.find((g: any) => g.id === activeChat.id);
            if (updatedChat) setActiveChat(updatedChat);
        }
    }, [groups]);

    // Suscripción al canal Echo del chat activo para señalización de llamadas
    useEffect(() => {
        if (!window.Echo || !activeChat) {
            setActiveChatChannel(null);
            return;
        }
        // window.Echo.private() devuelve el mismo canal si ya existe (no duplica)
        const channel = window.Echo.private(`chat.${activeChat.id}`);
        setActiveChatChannel(channel);
        // No hacemos leave aquí; ChatArea gestiona su propia suscripción al mismo canal.
    }, [activeChat?.id]);

    // Websockets globales (solicitudes de amistad, grupos nuevos, etc.)
    useEffect(() => {
        if (!window.Echo || !auth.user) return;

        window.Echo.join(`users.status`)
            .here((_users: any) => {})
            .joining((_user: any) => {})
            .leaving((_user: any) => {});

        window.Echo.private(`user.${auth.user.id}`)
            .listen('FriendRequestReceived', (e: any) => {
                toast.info(`${e.sender.name} te ha enviado una solicitud de amistad.`, { icon: '👥' });
                router.reload({ only: ['pendingRequests'] });
            })
            .listen('FriendRequestAccepted', (e: any) => {
                toast.success(`${e.friend.name} aceptó tu solicitud. ¡Chat individual creado!`, { icon: '🚀' });
                router.reload({ only: ['groups', 'friends'] });
            })
            .listen('GroupCreated', (_e: any) => {
                toast('¡Te han añadido a un nuevo chat grupal!', { icon: '💬' });
                router.reload({ only: ['groups'] });
            });

        return () => {
            window.Echo.leave(`users.status`);
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, []);

    // Seleccionar chat: en mobile pasa al panel de chat
    const handleChatSelect = (chat: any) => {
        setActiveChat(chat);
        setMobilePanel('chat');
    };

    // Ver detalles: en mobile pasa al panel de detalles
    const handleOpenDetails = () => setMobilePanel('details');

    // Volver desde detalles → chat, desde chat → lista
    const handleMobileBack = () => {
        if (mobilePanel === 'details') setMobilePanel('chat');
        else { setMobilePanel('list'); setActiveChat(null); }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />

            {/*
             * Desktop: los 3 paneles en fila (flex-row), visible siempre.
             * Mobile:  solo el panel activo es visible (w-full, absolute o translate).
             */}
            <div className="flex h-full w-full relative overflow-hidden">

                {/* ── Panel 1: Lista de chats ── */}
                <div className={[
                    // Desktop: siempre visible, ancho fijo
                    'md:relative md:flex md:w-80 md:shrink-0 md:translate-x-0',
                    // Mobile: full-width, se oculta cuando no es el panel activo
                    'absolute inset-0 w-full transition-transform duration-300 z-10',
                    mobilePanel === 'list' ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                ].join(' ')}>
                    <ChatSidebar
                        onOpenSearch={() => setIsSearchOpen(true)}
                        onOpenNewGroup={() => setIsCreateGroupOpen(true)}
                        onChatSelect={handleChatSelect}
                        activeChat={activeChat}
                        groups={localGroups}
                        pendingRequests={pendingRequests}
                    />
                </div>

                {/* ── Panel 2 + 3: Área de chat y detalles (desktop: flex-row, mobile: paneles apilados) ── */}
                <div className={[
                    'flex-1 flex overflow-hidden',
                    // Mobile: absolute, ocupa todo, se muestra solo cuando no estamos en lista
                    'absolute inset-0 md:relative md:inset-auto',
                    'transition-transform duration-300',
                    mobilePanel === 'list' ? 'translate-x-full md:translate-x-0' : 'translate-x-0',
                ].join(' ')}>

                    {!activeChat ? (
                        /* Estado vacío — solo desktop (en mobile nunca llega aquí sin chat) */
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0">
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                            <div className="bg-[var(--color-accent)]/10 p-5 rounded-full mb-6 relative z-10">
                                <span className="text-[var(--color-accent)] text-4xl"><MessageCircle /></span>
                            </div>
                            <h2 className="text-2xl font-bold text-[#0D304A] dark:text-gray-100 mb-2 relative z-10">Plannio</h2>
                            <p className="text-[var(--color-sisth)]/60 dark:text-gray-400 font-medium relative z-10 text-center max-w-sm">
                                Selecciona un chat en el panel izquierdo o crea uno nuevo para comenzar a interactuar de forma segura.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Panel 2: Chat — en mobile se oculta cuando estamos en detalles */}
                            <div className={[
                                'flex-1 overflow-hidden',
                                // Mobile: se desliza a la izquierda cuando se muestran detalles
                                'transition-transform duration-300',
                                mobilePanel === 'details' ? '-translate-x-full md:translate-x-0' : 'translate-x-0',
                                'absolute inset-0 md:relative md:inset-auto',
                            ].join(' ')}>
                                <ChatArea
                                    activeChat={activeChat}
                                    auth={auth}
                                    onMessagesUpdate={(msgs: any[]) => {
                                        setChatMessages(msgs);
                                        if (activeChat && msgs.length > 0) bumpGroupToTop(activeChat.id);
                                    }}
                                    onOpenMedia={setLightboxMedia}
                                    onStartCall={startCall}
                                    callState={callState}
                                    onBack={handleMobileBack}
                                    onOpenDetails={handleOpenDetails}
                                />
                            </div>

                            {/* Panel 3: Detalles — en mobile desliza desde la derecha */}
                            <div className={[
                                'transition-transform duration-300',
                                // Desktop: siempre visible junto al chat
                                'md:relative md:translate-x-0',
                                // Mobile: absolute, desliza
                                'absolute inset-0',
                                mobilePanel === 'details' ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
                            ].join(' ')}>
                                <ChatDetails
                                    activeChat={activeChat}
                                    messages={chatMessages}
                                    onOpenMedia={setLightboxMedia}
                                    auth={auth}
                                    onBack={() => setMobilePanel('chat')}
                                />
                            </div>
                        </>
                    )}
                </div>

                <SearchUsersModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} friends={friends} />

                {/* Modal de llamada activa */}
                <CallModal
                    callState={callState}
                    callType={callType}
                    localStream={localStream}
                    remotePeers={remotePeers}
                    isMuted={isMuted}
                    isCamOff={isCamOff}
                    chatName={activeChat?.name ?? 'Llamada'}
                    authAvatar={auth.user.avatar}
                    onHangUp={hangUp}
                    onToggleMute={toggleMute}
                    onToggleCamera={toggleCamera}
                />

                {/* Notificación de llamada entrante */}
                <IncomingCallNotification
                    call={incomingCall}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                />

                {/* Lightbox — soporta galería multi-item */}
                {lightboxMedia && (() => {
                    // lightboxMedia puede ser un objeto mensaje o { items, index }
                    const isGallery = Array.isArray(lightboxMedia?.items);
                    const galleryItems: any[] = isGallery ? lightboxMedia.items : [lightboxMedia];
                    const currentIdx: number  = isGallery ? (lightboxMedia.index ?? 0) : 0;
                    const current = galleryItems[currentIdx];

                    const goTo = (idx: number) => {
                        if (!isGallery) return;
                        setLightboxMedia({ items: galleryItems, index: idx });
                    };

                    return (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
                            {/* Cerrar */}
                            <button
                                onClick={() => setLightboxMedia(null)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            {/* Contador galería */}
                            {galleryItems.length > 1 && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                    {currentIdx + 1} / {galleryItems.length}
                                </div>
                            )}

                            {/* Navegación prev */}
                            {galleryItems.length > 1 && currentIdx > 0 && (
                                <button
                                    onClick={() => goTo(currentIdx - 1)}
                                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                                >
                                    ‹
                                </button>
                            )}

                            {/* Media */}
                            <div className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center">
                                {current?.type === 2 || current?.media_url?.match(/\.(jpe?g|png|gif|webp|avif)($|\?)/i) ? (
                                    <img src={current.media_url} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
                                ) : (
                                    <video src={current?.media_url} controls autoPlay className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
                                )}
                            </div>

                            {/* Navegación next */}
                            {galleryItems.length > 1 && currentIdx < galleryItems.length - 1 && (
                                <button
                                    onClick={() => goTo(currentIdx + 1)}
                                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                                >
                                    ›
                                </button>
                            )}

                            {/* Descargar */}
                            {current?.media_url && (
                                <a
                                    href={current.media_url}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="absolute bottom-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                                    title="Descargar"
                                >
                                    ↓
                                </a>
                            )}
                        </div>
                    );
                })()}
            </div>
        </AppLayout>
    );
}
