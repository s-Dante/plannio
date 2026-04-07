import { useState } from 'react';
import { Place } from '@/pages/TouristMap/Index';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Star, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, router } from '@inertiajs/react';

const styles = {
    sidebarBase: "w-full h-full flex flex-col bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-white/20 dark:border-stone-700/50 shadow-2xl rounded-[2rem] overflow-hidden transition-all relative",
    headerContainer: "p-6 pb-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-gray-100 dark:border-stone-800/80 sticky top-0 z-10",
    headerTitle: "text-2xl font-extrabold text-[#0D304A] dark:text-gray-100 flex items-center justify-between",
    headerSubtitle: "text-sm font-semibold text-[var(--color-sisth)]/60 mt-1",
    listContainer: "flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar",
    placeCardBase: "group w-full rounded-2xl bg-gray-50/50 dark:bg-stone-800/50 border border-gray-100 dark:border-stone-700/50 p-4 flex flex-col justify-center hover:shadow-md hover:bg-white dark:hover:bg-stone-800 hover:border-[var(--color-accent)]/30 transition-all cursor-pointer overflow-hidden relative",
    placeCardTitle: "font-bold text-[#0D304A] dark:text-gray-100 text-base leading-tight group-hover:text-[var(--color-accent)] transition-colors mb-1 pr-6",
    placeCardCategory: "text-xs text-[var(--color-sisth)]/60 font-semibold uppercase tracking-wide",
    fadeBottom: "absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none"
};

const categoryMap: Record<number, string> = {
    1: 'Naturaleza',
    2: 'Cultura & Museos',
    3: 'Deporte & Entretenimiento',
    4: 'Gastronomía'
};

interface Props {
    places: Place[];
    activePlace: Place | null;
    onPlaceSelect: (p: Place | null) => void;
    addingMode: boolean;
    setAddingMode: (val: boolean) => void;
    newPlaceCoords: {lat: number, lng: number} | null;
    setNewPlaceCoords: (val: null) => void;
}

export function MapSidebar({ places, activePlace, onPlaceSelect, addingMode, setAddingMode, newPlaceCoords, setNewPlaceCoords }: Props) {
    const [filterOfficial, setFilterOfficial] = useState<boolean>(true);

    const filteredPlaces = places?.filter(p => filterOfficial ? p.is_official_venue : true);

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        description: '',
        category: '1',
    });

    const [ratingVal, setRatingVal] = useState(0);

    const handleAddPlace = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/map/places', {
            ...data,
            latitude: newPlaceCoords?.lat,
            longitude: newPlaceCoords?.lng,
        }, {
            onSuccess: () => {
                setAddingMode(false);
                setNewPlaceCoords(null);
                reset();
            }
        });
    };

    const handleRate = () => {
        if (!activePlace || ratingVal === 0) return;
        router.post(`/map/places/${activePlace.id}/rate`, {
            rating: ratingVal,
            comment: null
        });
    };

    if (addingMode) {
        return (
            <div className={styles.sidebarBase}>
                <div className={styles.headerContainer}>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setAddingMode(false)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h2 className={styles.headerTitle}>Nuevo Lugar</h2>
                    </div>
                </div>
                <div className={styles.listContainer}>
                    <form onSubmit={handleAddPlace} className="space-y-4">
                        <div className="space-y-1">
                            <Label>Nombre del Lugar</Label>
                            <Input placeholder="Ej. Barrio Antiguo" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label>Descripción</Label>
                            <Input placeholder="Cuéntanos un poco..." value={data.description} onChange={e => setData('description', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label>Categoría</Label>
                            <Select onValueChange={(v) => setData('category', v)} defaultValue={data.category}>
                                <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Naturaleza</SelectItem>
                                    <SelectItem value="2">Cultura & Museos</SelectItem>
                                    <SelectItem value="3">Deporte & Entretenimiento</SelectItem>
                                    <SelectItem value="4">Gastronomía</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-4 p-4 mt-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 border-dashed text-sm text-blue-800 dark:text-blue-300">
                            <strong>Ubicación:</strong><br />
                            {newPlaceCoords ? (
                                <span className="font-mono">{newPlaceCoords.lat.toFixed(4)}, {newPlaceCoords.lng.toFixed(4)}</span>
                            ) : (
                                <span>Por favor, haz clic en un punto del mapa para fijar la ubicación.</span>
                            )}
                        </div>

                        <Button type="submit" disabled={!newPlaceCoords} className="w-full rounded-xl bg-[var(--color-accent)] hover:bg-[#829965] mt-4">
                            Guardar Lugar
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    if (activePlace) {
        return (
            <div className={styles.sidebarBase}>
                <div className={styles.headerContainer}>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => onPlaceSelect(null)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h2 className="text-xl font-bold text-[#0D304A] dark:text-gray-100 truncate">{activePlace.name}</h2>
                    </div>
                </div>
                <div className={styles.listContainer}>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                            {categoryMap[activePlace.category] || 'Otros'}
                        </span>
                        {activePlace.is_official_venue && (
                            <span className="px-2 py-0.5 rounded-md bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] text-xs font-bold">Oficial</span>
                        )}
                    </div>
                    
                    <p className="text-[var(--color-sisth)]/80 text-sm mt-3 leading-relaxed">
                        {activePlace.description}
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-stone-800">
                        <h4 className="font-bold text-sm mb-2 opacity-80">Califica este lugar</h4>
                        <div className="flex gap-1 mb-4">
                            {[1,2,3,4,5].map((s) => (
                                <Star 
                                    key={s} 
                                    className={cn("h-8 w-8 cursor-pointer transition-colors", ratingVal >= s ? "fill-[var(--color-tertiary)] text-[var(--color-tertiary)]" : "text-gray-300 dark:text-stone-600")}
                                    onClick={() => setRatingVal(s)}
                                />
                            ))}
                        </div>
                        <Button variant="secondary" onClick={handleRate} disabled={ratingVal === 0} className="w-full rounded-xl">
                            Enviar Puntuación
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Label>Puntuación Global</Label>
                        <div className="text-3xl font-extrabold text-[#0D304A] dark:text-gray-100 mt-1 flex items-center gap-2">
                            {activePlace.average_rating > "0.00" ? Number(activePlace.average_rating).toFixed(1) : '-.-'}
                            <Star className="h-6 w-6 text-[var(--color-tertiary)] fill-[var(--color-tertiary)]" />
                        </div>
                        <p className="text-xs opacity-50 mt-1">De {activePlace.ratings_count} usuarios</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.sidebarBase}>
            <div className={styles.headerContainer}>
                <div className={styles.headerTitle}>
                    <span>Explora <br /><span className={styles.headerSubtitle}>Monterrey, N.L.</span></span>
                    
                    <Button size="icon" className="h-10 w-10 rounded-full bg-[var(--color-accent)] hover:bg-[#829965] shadow-lg shadow-[#ADC178]/30 shrink-0" onClick={() => setAddingMode(true)}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                
                <div className="flex gap-2 mt-4 bg-gray-100/50 dark:bg-stone-800/50 p-1 rounded-xl">
                    <button 
                        onClick={() => setFilterOfficial(true)}
                        className={cn("flex-1 text-xs font-bold py-1.5 rounded-lg transition-all", filterOfficial ? "bg-white dark:bg-stone-700 shadow-sm text-[#0D304A] dark:text-gray-100" : "text-gray-500")}
                    >
                        Plannio
                    </button>
                    <button 
                        onClick={() => setFilterOfficial(false)}
                        className={cn("flex-1 text-xs font-bold py-1.5 rounded-lg transition-all", !filterOfficial ? "bg-white dark:bg-stone-700 shadow-sm text-[#0D304A] dark:text-gray-100" : "text-gray-500")}
                    >
                        Comunidad
                    </button>
                </div>
            </div>

            <div className={styles.listContainer}>
                {filteredPlaces?.map((place) => (
                    <div key={place.id} className={styles.placeCardBase} onClick={() => onPlaceSelect(place)}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={styles.placeCardTitle}>{place.name}</h3>
                                <p className={styles.placeCardCategory}>{categoryMap[place.category] || 'General'}</p>
                            </div>
                            {place.average_rating > "0.00" && (
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded-md">
                                    <span className="text-xs font-bold">{Number(place.average_rating).toFixed(1)}</span>
                                    <Star className="h-3 w-3 fill-current" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredPlaces?.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <MapPin className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm">No hay lugares en esta categoría aún.</p>
                    </div>
                )}
            </div>

            <div className={styles.fadeBottom}></div>
        </div>
    );
}
