import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapSidebar } from '@/components/map/map-sidebar';

const breadcrumbs = [
    {
        title: 'Mapa Turístico',
        href: '/map',
    },
];

export default function MapIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Explorar Monterrey" />

            <div className="relative w-full h-full overflow-hidden bg-[#e5e3df] dark:bg-stone-900">
                {/* 
                  Full Screen Map Background Placeholder.
                  This simulates MapLibre/MapBox loaded behind the UI elements.
                */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80")',
                        filter: 'brightness(0.95) contrast(1.1) saturate(1.2)'
                    }}
                />

                {/* Floating Map Controls Placeholder (Right Side) */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
                    <button className="h-10 w-10 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-gray-100 dark:border-stone-700 flex items-center justify-center text-[var(--color-sisth)] hover:text-[var(--color-accent)] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </button>
                    <button className="h-10 w-10 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-gray-100 dark:border-stone-700 flex items-center justify-center text-[var(--color-sisth)] hover:text-[var(--color-accent)] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                    </button>
                    <button className="h-10 w-10 bg-white dark:bg-stone-800 rounded-xl shadow-lg border border-gray-100 dark:border-stone-700 flex items-center justify-center text-[var(--color-sisth)] hover:text-[var(--color-accent)] transition-colors mt-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </button>
                </div>

                {/* Main Overlay UI (Sidebar) */}
                <div className="absolute inset-y-0 left-0 p-4 lg:p-6 w-full md:w-96 lg:w-[420px] z-20 pointer-events-none">
                    <div className="w-full h-full pointer-events-auto">
                        <MapSidebar />
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
