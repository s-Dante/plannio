const styles = {
    sidebarBase: "w-full h-full flex flex-col bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-white/20 dark:border-stone-700/50 shadow-2xl rounded-[2rem] overflow-hidden transition-all relative",

    headerContainer: "p-6 pb-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md border-b border-gray-100 dark:border-stone-800/80 sticky top-0 z-10",
    headerTitle: "text-2xl font-extrabold text-[#0D304A] dark:text-gray-100",
    headerSubtitle: "text-sm font-semibold text-[var(--color-sisth)]/60",

    listContainer: "flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar",

    placeCardBase: "group w-full rounded-2xl bg-white dark:bg-stone-800/80 border border-gray-100 dark:border-stone-700/50 p-4 flex flex-col justify-center hover:shadow-lg hover:border-[var(--color-accent)]/30 transition-all cursor-pointer overflow-hidden relative",

    placeCardTitle: "font-bold text-[#0D304A] dark:text-gray-100 text-base leading-tight group-hover:text-[var(--color-accent)] transition-colors mb-1",
    placeCardCategory: "text-xs text-[var(--color-sisth)]/60 font-semibold uppercase tracking-wide",

    fadeBottom: "absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white dark:from-stone-900 to-transparent pointer-events-none"
};

export function MapSidebar() {

    const places = [
        { id: 1, name: 'Parque Fundidora', category: 'Naturaleza' },
        { id: 2, name: 'Museo MARCO', category: 'Cultura' },
        { id: 3, name: 'Paseo Santa Lucía', category: 'Atracción' },
        { id: 4, name: 'Cerro de la Silla', category: 'Aventura' },
        { id: 5, name: 'Barrio Antiguo', category: 'Gastronomía' },
    ];

    return (
        <div className={styles.sidebarBase}>

            <div className={styles.headerContainer}>
                <div>
                    <h2 className={styles.headerTitle}>Explora</h2>
                    <p className={styles.headerSubtitle}>Monterrey, N.L.</p>
                </div>
            </div>

            <div className={styles.listContainer}>

                {places.map((place) => (
                    <div key={place.id} className={styles.placeCardBase}>
                        <h3 className={styles.placeCardTitle}>{place.name}</h3>
                        <p className={styles.placeCardCategory}>{place.category}</p>
                    </div>
                ))}

            </div>

            <div className={styles.fadeBottom}></div>
        </div>
    );
}
