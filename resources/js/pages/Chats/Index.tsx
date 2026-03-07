import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ChatSidebar } from '@/components/chats/chat-sidebar';
import { ChatArea } from '@/components/chats/chat-area';
import { ChatDetails } from '@/components/chats/chat-details';

const breadcrumbs = [
    {
        title: 'Chats',
        href: '/chats',
    },
];

export default function ChatsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chats" />

            <div className="flex h-full w-full">
                {/* Column 1: Conversations List */}
                <ChatSidebar />

                {/* Column 2: Active Chat Area */}
                <ChatArea />

                {/* Column 3: Active Chat Details (Tasks, Media) */}
                <ChatDetails />
            </div>
        </AppLayout>
    );
}
