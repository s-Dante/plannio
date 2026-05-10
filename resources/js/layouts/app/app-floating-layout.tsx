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

    // ── Notificación global de llamada entrante ───────────────────────────────
    // Se muestra en cualquier vista de la app (chats, mapa, tareas, etc.)
    const [incomingCallGlobal, setIncomingCallGlobal] = useState<IncomingCallInfo | null>(null);

    useEffect(() => {
        if (!window.Echo || !auth?.user) return;

        const channel = window.Echo.private(`user.${auth.user.id}`);

        channel.listen('.CallInitiated', (e: { callData: IncomingCallInfo }) => {
            if (e.callData.caller.id === auth.user.id) return; // yo soy el caller
            setIncomingCallGlobal(e.callData);
        });

        // No hacemos stopListening: Chats/Index también usa este canal para otros eventos.
    }, [auth?.user?.id]);

    // ── Aceptar ───────────────────────────────────────────────────────────────
    const handleGlobalAccept = () => {
        if (!incomingCallGlobal) return;

        if (url.startsWith('/chats')) {
            // Ya estamos en /chats: delegar al hook de useCall vía evento DOM.
            // ChatsIndex escucha 'call:accept' y llama a acceptCall().
            window.dispatchEvent(new CustomEvent('call:accept', { detail: incomingCallGlobal }));
        } else {
            // En otra página: guardar y navegar. ChatsIndex al montar leerá
            // sessionStorage, seleccionará el chat y el hook auto-aceptará.
            sessionStorage.setItem('pendingIncomingCall',        JSON.stringify(incomingCallGlobal));
            sessionStorage.setItem('pendingIncomingCall_Accept', 'true');
            router.visit('/chats');
        }

        setIncomingCallGlobal(null);
    };

    // ── Rechazar ──────────────────────────────────────────────────────────────
    const handleGlobalReject = () => {
        if (url.startsWith('/chats')) {
            // Pedir a ChatsIndex que limpie el estado interno del hook
            window.dispatchEvent(new CustomEvent('call:reject'));
        }
        setIncomingCallGlobal(null);
    };

    return (
        <div className="flex h-dvh w-full items-center justify-center bg-gray-200/60 dark:bg-stone-900 md:p-4">
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden md:rounded-3xl bg-white shadow-2xl dark:bg-stone-950/80 ring-1 ring-gray-950/5 dark:ring-white/10
                            flex-col md:flex-row">
                <FloatingSidebar />
                <main className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-stone-900/40 order-first md:order-none">
                    {children}
                </main>
            </div>

            {/*
             * Portal → se monta directamente bajo <body>, fuera del contenedor
             * con overflow-hidden. La notificación es visible en toda la app
             * y siempre aparece por encima de cualquier otro elemento (z-[9999]).
             */}
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
