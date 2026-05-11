import { FloatingSidebar } from '@/components/floating-sidebar';
import { IncomingCallNotification } from '@/components/chats/incoming-call-notification';
import type { AppLayoutProps } from '@/types';
import type { IncomingCallInfo } from '@/hooks/use-call';
import { usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function AppFloatingLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth } = usePage<any>().props;
    const { url }  = usePage();

    // Notificación global de llamada entrante
    const [incomingCallGlobal, setIncomingCallGlobal] = useState<IncomingCallInfo | null>(null);

    useEffect(() => {
        if (!window.Echo || !auth?.user) return;

        const channel = window.Echo.private(`user.${auth.user.id}`);

        channel.listen('.CallInitiated', (e: { callData: IncomingCallInfo }) => {
            if (e.callData.caller.id === auth.user.id) return;
            setIncomingCallGlobal(e.callData);
        });
    }, [auth?.user?.id]);

    // Aceptar
    const handleGlobalAccept = () => {
        if (!incomingCallGlobal) return;

        if (url.startsWith('/chats')) {
            // Si ya estamos en /chats
            window.dispatchEvent(new CustomEvent('call:accept', { detail: incomingCallGlobal }));
        } else {
            // Si estamos en otra pagina
            sessionStorage.setItem('pendingIncomingCall',        JSON.stringify(incomingCallGlobal));
            sessionStorage.setItem('pendingIncomingCall_Accept', 'true');
            router.visit('/chats');
        }

        setIncomingCallGlobal(null);
    };

    // Rechazar
    const handleGlobalReject = () => {
        if (url.startsWith('/chats')) {
            window.dispatchEvent(new CustomEvent('call:reject'));
        }
        setIncomingCallGlobal(null);
    };

    return (
        <div className="flex h-dvh w-full overflow-hidden items-center justify-center bg-gray-200/60 dark:bg-stone-900 md:p-4">
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden md:rounded-3xl bg-white shadow-2xl dark:bg-stone-950/80 ring-1 ring-gray-950/5 dark:ring-white/10
                            flex-col md:flex-row">
                <FloatingSidebar />
                <main className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-stone-900/40 order-first md:order-none">
                    {children}
                </main>
            </div>

            {incomingCallGlobal && createPortal(
                <IncomingCallNotification
                    call={incomingCallGlobal}
                    onAccept={handleGlobalAccept}
                    onReject={handleGlobalReject}
                />,
                document.body
            )}
        </div>
    );
}
