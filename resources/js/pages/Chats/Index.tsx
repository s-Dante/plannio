import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChatSidebar } from '@/components/chats/chat-sidebar';
import { ChatArea } from '@/components/chats/chat-area';
import { ChatDetails } from '@/components/chats/chat-details';
import { SearchUsersModal } from '@/components/chats/search-users-modal';
import { CreateGroupModal } from '@/components/chats/create-group-modal';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// import echo from '@/lib/echo';

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

    // WebSockets Real-Time Mounting
    useEffect(() => {
        if (!window.Echo || !auth.user) return;

        // Presence Channel (Globally tracking who is connected in the background)
        const presenceChannel = window.Echo.join(`users.status`)
            .here((users: any) => {
                // Initial load of connected users
            })
            .joining((user: any) => {
                // Someone connected (Update their badge icon to green)
            })
            .leaving((user: any) => {
                // Someone left
            });

        // Private Tracking Channel containing personal events
        window.Echo.private(`user.${auth.user.id}`)
            .listen('FriendRequestReceived', (e: any) => {
                toast.info(`${e.sender.name} te ha enviado una solicitud de amistad.`, {
                    icon: '👥'
                });
                router.reload({ only: ['pendingRequests'] });
            })
            .listen('FriendRequestAccepted', (e: any) => {
                toast.success(`${e.friend.name} aceptó tu solicitud. ¡Chat individual creado!`, {
                    icon: '🚀'
                });
                router.reload({ only: ['groups', 'friends'] });
            })
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
                    groups={groups} 
                    pendingRequests={pendingRequests} 
                />

                <ChatArea />

                <ChatDetails />

                {/* Modals Injected at top level */}
                <SearchUsersModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} friends={friends} />
            </div>
        </AppLayout>
    );
}
