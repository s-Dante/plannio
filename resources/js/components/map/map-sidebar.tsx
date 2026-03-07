import { MapPin, Search, Star, Navigation, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function MapSidebar() {

    // Mock Data para lugares
    const places = [
        { id: 1, name: 'Parque Fundidora', rating: 4.8, category: 'Naturaleza', image: 'https://images.unsplash.com/photo-1579705745100-c971ebbf9f45?w=200&h=200&fit=crop' },
        { id: 2, name: 'Museo MARCO', rating: 4.9, category: 'Cultura', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=200&h=200&fit=crop' },
        { id: 3, name: 'Paseo Santa Lucía', rating: 4.7, category: 'Atracción', image: 'https://images.unsplash.com/photo-1588636511634-1925b4104d44?w=200&h=200&fit=crop' },
        { id: 4, name: 'Cerro de la Silla', rating: 4.9, category: 'Aventura', image: 'https://images.unsplash.com/photo-1629853372295-8eb66195fb2d?w=200&h=200&fit=crop' },
        { id: 5, name: 'Barrio Antiguo', rating: 4.6, category: 'Gastronomía', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop' },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-white/20 dark:border-stone-700/50 shadow-2xl rounded-[2rem] overflow-hidden transition-all relative">

            {/* Header & Search */}
            <div className="p-6 pb-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-gray-100 dark:border-stone-800/80 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-extrabold text-[#0D304A] dark:text-gray-100">Explora</h2>
                        <p className="text-sm font-semibold text-[var(--color-sisth)]/60">Monterrey, N.L.</p>
                    </div>
                    <button className="h-10 w-10 rounded-full bg-gray-100 dark:bg-stone-800 text-[var(--color-sisth)] flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-sisth)]/40 font-bold" />
                    <Input
                        placeholder="Buscar lugares, restaurantes..."
                        className="pl-12 bg-[#f6f7f9] dark:bg-stone-800 border-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 rounded-2xl h-12 text-sm font-medium placeholder:text-[var(--color-sisth)]/40 shadow-inner"
                    />
                </div>
            </div>

            {/* Categories Pills */}
            <div className="flex overflow-x-auto gap-2 px-6 py-4 no-scrollbar border-b border-gray-50 dark:border-stone-800/50 bg-white/20">
                <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold shadow-md shadow-[var(--color-accent)]/20">Todos</button>
                <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-100 dark:bg-stone-800 text-[var(--color-sisth)]/80 text-xs font-bold hover:bg-gray-200 transition-colors">Naturaleza</button>
                <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-100 dark:bg-stone-800 text-[var(--color-sisth)]/80 text-xs font-bold hover:bg-gray-200 transition-colors">Cultura</button>
                <button className="whitespace-nowrap px-4 py-1.5 rounded-full bg-gray-100 dark:bg-stone-800 text-[var(--color-sisth)]/80 text-xs font-bold hover:bg-gray-200 transition-colors">Gastronomía</button>
            </div>

            {/* Places List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar">

                {places.map((place) => (
                    <div key={place.id} className="group relative w-full rounded-2xl bg-white dark:bg-stone-800/80 border border-gray-100 dark:border-stone-700/50 p-2.5 flex items-center gap-4 hover:shadow-lg hover:border-[var(--color-accent)]/30 transition-all cursor-pointer overflow-hidden">

                        {/* Image Thumbnail */}
                        <div className="h-20 w-20 rounded-xl bg-gray-200 shrink-0 overflow-hidden relative">
                            <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-[#0D304A] dark:text-gray-100 text-sm leading-tight group-hover:text-[var(--color-accent)] transition-colors">{place.name}</h3>
                                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded text-amber-500">
                                    <Star className="w-3 h-3 fill-amber-500" />
                                    <span className="text-[10px] font-bold">{place.rating}</span>
                                </div>
                            </div>
                            <p className="text-xs text-[var(--color-sisth)]/60 font-medium mt-1 mb-2">{place.category}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> A 2.5 km
                                </p>
                            </div>
                        </div>

                        {/* Interactive Action Button (Hidden until hover on Desktop) */}
                        <button className="absolute right-4 bottom-3 h-8 w-8 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-sm">
                            <Navigation className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Gradient Fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none"></div>
        </div>
    );
}
