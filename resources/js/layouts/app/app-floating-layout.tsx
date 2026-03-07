import { FloatingSidebar } from '@/components/floating-sidebar';
import type { AppLayoutProps } from '@/types';

export default function AppFloatingLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-200/60 dark:bg-stone-900 p-4">
            {/* The main floating card container */}
            <div className="flex h-full w-full max-w-[1600px] overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-stone-950/80 ring-1 ring-gray-950/5 dark:ring-white/10">

                {/* Thin Sidebar on the left */}
                <FloatingSidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden bg-gray-100/50 dark:bg-stone-900/40">
                    {children}
                </main>
            </div>
        </div>
    );
}
