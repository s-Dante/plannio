import { FloatingSidebar } from '@/components/floating-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppFloatingLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
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
