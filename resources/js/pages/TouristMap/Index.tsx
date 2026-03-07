import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapSidebar } from '@/components/map/map-sidebar';

const breadcrumbs = [
    {
        title: 'Mapa Turístico',
        href: '/map',
    },
];

const styles = {
    container: "relative w-full h-full overflow-hidden bg-[#e5e3df] dark:bg-stone-900",

    mapBackground: "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000",

    sidebarOverlay: "absolute inset-y-0 left-0 p-4 lg:p-6 w-full md:w-96 lg:w-[420px] z-20 pointer-events-none",
    sidebarPointerEventsAuto: "w-full h-full pointer-events-auto",
};

export default function MapIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Explorar Monterrey" />

            <div className={styles.container}>
                <div
                    className={styles.mapBackground}
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80")',
                        filter: 'brightness(0.95) contrast(1.1) saturate(1.2)'
                    }}
                />

                <div className={styles.sidebarOverlay}>
                    <div className={styles.sidebarPointerEventsAuto}>
                        <MapSidebar />
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
