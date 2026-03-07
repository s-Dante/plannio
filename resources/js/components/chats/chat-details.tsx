import { Plus, CheckSquare, Clock, ArrowRight, Compass, Settings, MoreVertical } from 'lucide-react';

export function ChatDetails() {
    return (
        <div className="w-80 h-full hidden lg:flex flex-col bg-white dark:bg-stone-900 border-l border-gray-200 dark:border-stone-800 overflow-y-auto">

            {/* Header: Group Info */}
            <div className="p-6 pb-4 text-center border-b border-gray-100 dark:border-stone-800">
                <div className="h-24 w-24 rounded-full border-4 border-[var(--color-accent)]/20 bg-gray-100 dark:bg-stone-800 shadow-sm mx-auto mb-4 overflow-hidden relative group cursor-pointer">
                    {/* Placeholder image representation */}
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--color-accent)] font-bold text-3xl">M</div>
                </div>
                <h3 className="text-xl font-extrabold text-[#0D304A] dark:text-white">Mundial MTY 2026</h3>
                <p className="text-xs text-[var(--color-sisth)]/60 font-medium mt-1">4 miembros • Creado hace 2 días</p>
            </div>

            <div className="p-5 space-y-6">

                {/* Badges / Options */}
                <div className="flex justify-around bg-gray-50/80 dark:bg-stone-800/50 p-3 rounded-2xl">
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-white dark:bg-stone-700 shadow-sm flex items-center justify-center text-[var(--color-sisth)] group-hover:text-[var(--color-accent)] transition-colors">
                            <Compass className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--color-sisth)]/80">Ruta</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-white dark:bg-stone-700 shadow-sm flex items-center justify-center text-[var(--color-sisth)] group-hover:text-[var(--color-accent)] transition-colors">
                            <Settings className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--color-sisth)]/80">Ajustes</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="h-10 w-10 rounded-full bg-white dark:bg-stone-700 shadow-sm flex items-center justify-center text-[var(--color-sisth)] group-hover:text-[var(--color-accent)] transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--color-sisth)]/80">Más</span>
                    </div>
                </div>

                {/* Tasks Module */}
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-[var(--color-accent)]" />
                            <h4 className="text-sm font-bold text-[#0D304A] dark:text-gray-200">Tareas del Grupo</h4>
                        </div>
                        <button className="h-7 w-7 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-white flex items-center justify-center text-[var(--color-accent)] transition-colors">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-50 dark:bg-stone-800/50 p-3 rounded-xl">
                        <div className="flex justify-between items-center mb-1.5 text-xs">
                            <span className="font-semibold text-[var(--color-sisth)]/80">Progreso del plan</span>
                            <span className="font-bold text-[var(--color-accent)]">66%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-stone-700 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--color-accent)] rounded-full w-[66%]"></div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-3">
                        {/* Completed Task */}
                        <div className="group flex items-start gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-800/30 hover:shadow-sm transition-all outline outline-1 outline-transparent hover:outline-[var(--color-accent)]/30 cursor-pointer">
                            <div className="h-5 w-5 rounded-md mt-0.5 flex-shrink-0 flex items-center justify-center bg-[var(--color-accent)] text-white">
                                <CheckSquare className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-sisth)]/60 line-through">Comprar boletos</p>
                                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                    <div className="flex -space-x-1">
                                        <div className="h-4 w-4 rounded-full bg-blue-500 border border-white"></div>
                                    </div>
                                    <span className="text-[9px] font-semibold text-gray-400 flex items-center gap-1"><CheckSquare className="h-3 w-3" /> Completado por ti</span>
                                </div>
                            </div>
                        </div>

                        {/* Complete Task 2 */}
                        <div className="group flex items-start gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-800/30 hover:shadow-sm transition-all outline outline-1 outline-transparent hover:outline-[var(--color-accent)]/30 cursor-pointer">
                            <div className="h-5 w-5 rounded-md mt-0.5 flex-shrink-0 flex items-center justify-center bg-[var(--color-accent)] text-white">
                                <CheckSquare className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[var(--color-sisth)]/60 line-through">Reservar Airbnb</p>
                                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                    <div className="flex -space-x-1">
                                        <div className="h-4 w-4 rounded-full bg-orange-400 border border-white"></div>
                                        <div className="h-4 w-4 rounded-full bg-purple-400 border border-white"></div>
                                    </div>
                                    <span className="text-[9px] font-semibold text-gray-400">Completado ayer</span>
                                </div>
                            </div>
                        </div>

                        {/* Pending Task */}
                        <div className="group flex items-start gap-3 p-2.5 rounded-xl border border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:shadow-md transition-all outline outline-1 outline-transparent hover:outline-[var(--color-accent)] cursor-pointer">
                            <div className="h-5 w-5 rounded-md mt-0.5 flex-shrink-0 flex items-center justify-center border-2 border-[var(--color-sisth)]/20 group-hover:border-[var(--color-accent)] transition-colors">
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-[#0D304A] dark:text-gray-200">Definir ruta y restaurantes</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <div className="flex -space-x-1">
                                        <div className="h-5 w-5 rounded-full bg-[var(--color-primary)] border border-white flex items-center justify-center text-[8px] font-bold text-white">Tú</div>
                                        <div className="h-5 w-5 rounded-full bg-blue-200 text-blue-600 border border-white flex items-center justify-center text-[8px] font-bold">C</div>
                                    </div>
                                    <span className="text-[9px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> Hoy</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full text-center text-xs font-bold text-[var(--color-accent)] hover:underline pt-2 flex items-center justify-center gap-1">
                            Ver todas (5) <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Media/Shared Content Section */}
                <div className="pt-2 border-t border-gray-100 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-[#0D304A] dark:text-gray-200">Multimedia</h4>
                        <span className="text-xs text-[var(--color-accent)] font-semibold cursor-pointer">Ver todo</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-100 dark:bg-stone-800 rounded-xl hover:opacity-80 transition-opacity cursor-pointer border border-gray-200/50"></div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
