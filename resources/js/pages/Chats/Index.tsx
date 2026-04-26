import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChatSidebar } from '@/components/chats/chat-sidebar';
import { ChatArea } from '@/components/chats/chat-area';
import { ChatDetails } from '@/components/chats/chat-details';
import { SearchUsersModal } from '@/components/chats/search-users-modal';
import { CreateGroupModal } from '@/components/chats/create-group-modal';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MessageCircle, X } from 'lucide-react';


const breadcrumbs = [
    {
        title: 'Chats',
        href: '/chats',
    },
];

export default function ChatsIndex() {
    const { groups, pendingRequests, friends, auth } = usePage<any>().props;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [lightboxMedia, setLightboxMedia] = useState<any>(null);

    useEffect(() => {
        if (activeChat && groups) {
            const updatedChat = groups.find((g: any) => g.id === activeChat.id);
            if (updatedChat) setActiveChat(updatedChat);
        }
    }, [groups]);

    // Manejo de los Websocket para funcinamiento en tiempo real
    useEffect(() => {
        if (!window.Echo || !auth.user) return;

        // Manejo de el estatus de los usuarios
        //  Falta generar la funcionalidad completa
        const presenceChannel = window.Echo.join(`users.status`)
            .here((users: any) => {
            })
            .joining((user: any) => {
            })
            .leaving((user: any) => {
            });

        // Manejo de los eventos privados
        window.Echo.private(`user.${auth.user.id}`)
            // Se recive una solicitud de amistad
            .listen('FriendRequestReceived', (e: any) => {
                toast.info(`${e.sender.name} te ha enviado una solicitud de amistad.`, {
                    icon: '👥'
                });
                router.reload({ only: ['pendingRequests'] });
            })
            // Se acepta una solicitud de amistad
            .listen('FriendRequestAccepted', (e: any) => {
                toast.success(`${e.friend.name} aceptó tu solicitud. ¡Chat individual creado!`, {
                    icon: '🚀'
                });
                router.reload({ only: ['groups', 'friends'] });
            })
            // Se crea un nuevo grupo
            .listen('GroupCreated', (e: any) => {
                toast("¡Te han añadido a un nuevo chat grupal!", {
                    icon: '💬'
                });
                router.reload({ only: ['groups'] });
            });

        return () => {
            window.Echo.leave(`users.status`);
            window.Echo.leave(`user.${auth.user.id}`);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />

            <div className="flex h-full w-full relative">
                <ChatSidebar
                    onOpenSearch={() => setIsSearchOpen(true)}
                    onOpenNewGroup={() => setIsCreateGroupOpen(true)}
                    onChatSelect={setActiveChat}
                    activeChat={activeChat}
                    groups={groups}
                    pendingRequests={pendingRequests}
                />

                {!activeChat ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0">
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="bg-[var(--color-accent)]/10 p-5 rounded-full mb-6 relative z-10">
                            <span className="text-[var(--color-accent)] text-4xl">
                                <MessageCircle></MessageCircle>
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#0D304A] dark:text-gray-100 mb-2 relative z-10">Plannio</h2>
                        <p className="text-[var(--color-sisth)]/60 dark:text-gray-400 font-medium relative z-10 text-center max-w-sm">
                            Selecciona un chat en el panel izquierdo o crea uno nuevo para comenzar a interactuar de forma segura.
                        </p>
                    </div>
                ) : (
                    <>
                        <ChatArea 
                            activeChat={activeChat} 
                            auth={auth} 
                            onMessagesUpdate={setChatMessages}
                            onOpenMedia={setLightboxMedia}
                        />
                        <ChatDetails 
                            activeChat={activeChat} 
                            messages={chatMessages}
                            onOpenMedia={setLightboxMedia}
                            auth={auth}
                        />
                    </>
                )}

                <SearchUsersModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} friends={friends} />

                {/* Lightbox Modal */}
                {lightboxMedia && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
                        <button 
                            onClick={() => setLightboxMedia(null)}
                            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
                            {lightboxMedia.type === 2 ? (
                                <img src={lightboxMedia.media_url} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
                            ) : (
                                <video src={lightboxMedia.media_url} controls autoPlay className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"></video>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
