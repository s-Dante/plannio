import { FloatingSidebar } from '@/components/floating-sidebar';
import type { AppLayoutProps } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Phone, Video } from 'lucide-react';
import axios from 'axios';

export default function AppFloatingLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth } = usePage<any>().props;

    // Listener global para llamadas entrantes
    useEffect(() => {
        if (!window.Echo || !auth?.user) return;

        const channel = window.Echo.private(`user.${auth.user.id}`);

        channel.listen('.CallInitiated', (e: any) => {
            // Si ya estamos en la página de chats, no mostrar el toast global
            // porque el componente de chats ya mostrará el modal completo.
            if (window.location.pathname.startsWith('/chats')) return;

            const callerName = e.callData.caller.name;
            const isVideo = e.callData.type === 2;

            toast.custom((t) => (
                <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-800 flex flex-col gap-3 min-w-[300px] animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        {e.callData.caller.avatar ? (
                            <img src={e.callData.caller.avatar} className="w-10 h-10 rounded-full border-2 border-[var(--color-accent)]" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                                {callerName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-bold">{callerName}</p>
                            <p className="text-xs text-stone-400 flex items-center gap-1">
                                {isVideo ? <Video className="w-3 h-3"/> : <Phone className="w-3 h-3"/>}
                                {isVideo ? 'Videollamada entrante' : 'Llamada entrante'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => {
                                toast.dismiss(t);
                                axios.post(`/calls/${e.callData.call_id}/reject`).catch(() => {});
                            }}
                            className="flex-1 bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                        >
                            Ignorar
                        </button>
                        <button 
                            onClick={() => {
                                toast.dismiss(t);
                                sessionStorage.setItem('pendingIncomingCall', JSON.stringify(e.callData));
                                sessionStorage.setItem('pendingIncomingCall_Accept', 'true');
                                router.visit('/chats');
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            Contestar
                        </button>
                    </div>
                </div>
            ), { duration: 30000, position: 'top-center' }); // dura 30s
        });

        return () => {
            // No hacemos leave porque otros componentes (como Chats/Index)
            // también usan este canal para FriendRequests.
            // channel.stopListening('.CallInitiated');
        };
    }, [auth?.user?.id]);

    return (
        /*
         * Desktop: padding + rounded container con sidebar lateral izquierdo.
         * Mobile:  sin padding, full-screen, sidebar como bottom nav.
         */
        <div className="flex h-screen w-full items-center justify-center bg-gray-200/60 dark:bg-stone-900 md:p-4">
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden md:rounded-3xl bg-white shadow-2xl dark:bg-stone-950/80 ring-1 ring-gray-950/5 dark:ring-white/10
                            flex-col md:flex-row">
                {/*
                 * En desktop: FloatingSidebar renderiza el aside lateral (w-16/w-20).
                 * En mobile:  FloatingSidebar renderiza la bottom nav (h-16, w-full).
                 * El orden visual se invierte en mobile con order utilities.
                 */}
                <FloatingSidebar />
                <main className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-stone-900/40 order-first md:order-none">
                    {children}
                </main>
            </div>
        </div>
    );
}
