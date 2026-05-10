import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { MapSidebar } from '@/components/map/map-sidebar';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState, useEffect } from 'react';
import type { MapRef } from 'react-map-gl/maplibre';
import { MapPin, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DARK_STYLE  = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export interface Place {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    category: number;
    is_official_venue: boolean;
    average_rating: string;
    ratings_count: number;
    creator?: any;
    ratings?: any[];
}

const breadcrumbs = [
    {
        title: 'Mapa Turístico',
        href: '/map',
    },
];

const styles = {
    container: "relative w-full h-full overflow-hidden bg-[#e5e3df] dark:bg-stone-900 rounded-3xl",
    mapBackground: "absolute inset-0 transition-opacity duration-1000",
    sidebarOverlay: "absolute inset-y-0 left-0 p-3 md:p-4 lg:p-6 w-full md:w-[420px] lg:w-[460px] z-20 pointer-events-none",
    sidebarPointerEventsAuto: "w-full h-full pointer-events-auto",
    markerPin: "cursor-pointer group flex flex-col items-center",
    markerPopup: "absolute bottom-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl border border-gray-100 dark:border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-[#0D304A] dark:text-gray-100 pointer-events-none"
};

export default function MapIndex() {
    const { places, categories, auth } = usePage<any>().props;
    const mapRef = useRef<MapRef>(null);
    const [localPlaces, setLocalPlaces] = useState<Place[]>(places || []);
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const [addingMode, setAddingMode] = useState(false);
    const [newPlaceCoords, setNewPlaceCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    useEffect(() => {
        const obs = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (places) setLocalPlaces(places);
    }, [places]);

    useEffect(() => {
        if (!window.Echo) return;

        window.Echo.channel('tourist-map')
            .listen('PlaceRated', (e: any) => {
                setLocalPlaces(prev => prev.map(p =>
                    p.id === e.placeId
                        ? { ...p, average_rating: e.newAverage, ratings_count: e.totalVotes }
                        : p
                ));

                setActivePlace(prev => {
                    if (prev && prev.id === e.placeId) {
                        return { ...prev, average_rating: e.newAverage, ratings_count: e.totalVotes };
                    }
                    return prev;
                });
            });

        return () => window.Echo.leaveChannel('tourist-map');
    }, []);

    // Seteamos las coordenadas iniciales para que se vea Monterrey por defecto
    const initialViewState = {
        longitude: -100.316112,
        latitude: 25.686614,
        zoom: 12
    };

    const handleFlyTo = (place: Place | null) => {
        setActivePlace(place);
        setAddingMode(false);
        if (place) {
            mapRef.current?.flyTo({
                center: [place.longitude, place.latitude],
                zoom: 15,
                duration: 1800,
                essential: true
            });
        }
    };

    const handleMapClick = (evt: any) => {
        if (addingMode) {
            setNewPlaceCoords({ lng: evt.lngLat.lng, lat: evt.lngLat.lat });
            toast.info("Ubicación fijada. Completa los detalles en la barra lateral.");
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Explorar Monterrey" />

            <div className={styles.container}>
                <div className={styles.mapBackground}>
                    <Map
                        ref={mapRef}
                        initialViewState={initialViewState}
                        mapStyle={isDark ? DARK_STYLE : LIGHT_STYLE}
                        interactive={true}
                        onClick={handleMapClick}
                        cursor={addingMode ? 'crosshair' : 'grab'}
                    >
                        <NavigationControl position="bottom-right" />

                        {localPlaces?.map((place: Place) => (
                            <Marker
                                key={place.id}
                                longitude={place.longitude}
                                latitude={place.latitude}
                                anchor="bottom"
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    handleFlyTo(place);
                                }}
                            >
                                <div className={styles.markerPin}>
                                    <div className={styles.markerPopup}>
                                        {place.name}
                                    </div>
                                    <MapPin
                                        className={cn(
                                            "h-8 w-8 drop-shadow-md transition-all",
                                            place.is_official_venue ? "text-[var(--color-accent)]" : "text-blue-500",
                                            activePlace?.id === place.id && "scale-125 -translate-y-2 h-10 w-10 text-[var(--color-tertiary)]"
                                        )}
                                        fill="currentColor"
                                    />
                                </div>
                            </Marker>
                        ))}

                        {addingMode && newPlaceCoords && (
                            <Marker longitude={newPlaceCoords.lng} latitude={newPlaceCoords.lat} anchor="bottom">
                                <div className={styles.markerPin}>
                                    <div className={styles.markerPopup} style={{ opacity: 1, backgroundColor: 'var(--color-tertiary)', color: 'white' }}>
                                        Nuevo Punto
                                    </div>
                                    <MapPin className="h-10 w-10 text-red-500 drop-shadow-xl animate-bounce" fill="currentColor" />
                                </div>
                            </Marker>
                        )}
                    </Map>
                </div>

                <div className={cn(
                    styles.sidebarOverlay,
                    'transition-transform duration-300',
                    !sidebarOpen && '-translate-x-full md:translate-x-0',
                )}>
                    <div className={styles.sidebarPointerEventsAuto}>
                        <MapSidebar
                            places={localPlaces}
                            categories={categories}
                            activePlace={activePlace}
                            onPlaceSelect={(place) => { handleFlyTo(place); setSidebarOpen(false); }}
                            addingMode={addingMode}
                            setAddingMode={setAddingMode}
                            newPlaceCoords={newPlaceCoords}
                            setNewPlaceCoords={setNewPlaceCoords}
                        />
                    </div>
                </div>

                <button
                    onClick={() => setSidebarOpen(v => !v)}
                    className={cn(
                        'md:hidden absolute bottom-6 left-4 z-30 pointer-events-auto',
                        'flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl font-bold text-sm transition-all',
                        sidebarOpen
                            ? 'bg-[var(--color-sisth)] text-white'
                            : 'bg-white text-[var(--color-sisth)] border-2 border-[var(--color-sisth)]'
                    )}
                >
                    {sidebarOpen ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    {sidebarOpen ? 'Cerrar' : 'Lugares'}
                </button>

            </div>
        </AppLayout>
    );
}
