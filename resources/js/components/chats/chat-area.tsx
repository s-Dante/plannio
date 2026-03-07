import { Phone, Video, Lock, Paperclip, Smile, Mic, Users, Check, CheckCheck } from 'lucide-react';

export function ChatArea() {
    return (
        <div className="flex-1 flex flex-col h-full bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0">
            {/* Background Pattern (Optional subtle pattern like WhatsApp) */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>

            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-stone-800 flex items-center justify-between px-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 leading-tight">Mundial MTY 2026</h3>
                        <span className="text-xs text-green-500 font-medium">4 en línea</span>
                    </div>
                </div>
                <div className="flex items-center gap-5 text-[var(--color-sisth)]/60 dark:text-gray-400">
                    <button className="hover:text-[var(--color-accent)] transition-colors"><Phone className="h-5 w-5" /></button>
                    <button className="hover:text-[var(--color-accent)] transition-colors"><Video className="h-5 w-5" /></button>
                    <div className="w-px h-5 bg-gray-300 dark:bg-stone-700 mx-1"></div>
                    <button className="hover:text-yellow-600 outline-none flex items-center gap-1 group">
                        <Lock className="h-4 w-4 text-yellow-500 group-hover:text-yellow-600" />
                        <span className="text-xs hidden sm:block text-yellow-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">E2E</span>
                    </button>
                    <button className="hover:text-[var(--color-sisth)] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col relative z-0">

                {/* Date Divider */}
                <div className="flex justify-center my-2">
                    <span className="bg-white dark:bg-stone-800 text-[10px] font-bold text-gray-500 uppercase px-3 py-1 rounded-lg shadow-sm border border-gray-100 dark:border-stone-700">HOY</span>
                </div>

                {/* Received Message */}
                <div className="flex justify-start">
                    <div className="relative bg-white dark:bg-stone-800 text-gray-800 dark:text-gray-200 p-3 px-4 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm border border-gray-100 dark:border-stone-700">
                        {/* Triangle Tail */}
                        <svg className="absolute top-0 -left-2 w-3 h-4 text-white dark:text-stone-800" viewBox="0 0 8 13" fill="currentColor">
                            <path d="M8 0H0L8 13V0Z" />
                        </svg>
                        <span className="text-xs font-bold text-orange-500 mb-1 block">@carlos_g</span>
                        <p className="text-sm leading-relaxed">¿Ya planearon qué hacer saliendo del estadio?</p>
                        <span className="text-[10px] text-gray-400 block text-right mt-1">10:42 AM</span>
                    </div>
                </div>

                {/* Sent Message */}
                <div className="flex justify-end">
                    <div className="relative bg-[var(--color-accent)] text-[var(--color-sisth)] p-3 px-4 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
                        {/* Triangle Tail */}
                        <svg className="absolute top-0 -right-2 w-3 h-4 text-[var(--color-accent)]" viewBox="0 0 8 13" fill="currentColor">
                            <path d="M0 0H8L0 13V0Z" />
                        </svg>
                        <p className="text-sm leading-relaxed font-medium">Claro, guardé varios restaurantes cerca en nuestras tareas compartidas de la derecha.</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-[var(--color-sisth)]/60">10:45 AM</span>
                            <CheckCheck className="w-3 h-3 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Sent Message Short */}
                <div className="flex justify-end">
                    <div className="relative bg-[var(--color-accent)] text-[var(--color-sisth)] p-3 px-4 rounded-2xl rounded-tr-none max-w-[70%] shadow-sm">
                        <svg className="absolute top-0 -right-2 w-3 h-4 text-[var(--color-accent)]" viewBox="0 0 8 13" fill="currentColor">
                            <path d="M0 0H8L0 13V0Z" />
                        </svg>
                        <p className="text-sm leading-relaxed font-medium">Ahorita le agrego los horarios.</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[10px] text-[var(--color-sisth)]/60">10:46 AM</span>
                            <Check className="w-3 h-3 text-[var(--color-sisth)]/40" />
                        </div>
                    </div>
                </div>

                {/* Received Message */}
                <div className="flex justify-start">
                    <div className="relative bg-white dark:bg-stone-800 text-gray-800 dark:text-gray-200 p-3 px-4 rounded-2xl rounded-tl-none max-w-[70%] shadow-sm border border-gray-100 dark:border-stone-700">
                        <svg className="absolute top-0 -left-2 w-3 h-4 text-white dark:text-stone-800" viewBox="0 0 8 13" fill="currentColor">
                            <path d="M8 0H0L8 13V0Z" />
                        </svg>
                        <span className="text-xs font-bold text-blue-500 mb-1 block">@ana_travel</span>
                        <p className="text-sm leading-relaxed">¡Perfecto! Nos vemos en la estación del metro Cuauhtémoc para irnos todos juntos entonces.</p>
                        <span className="text-[10px] text-gray-400 block text-right mt-1">10:50 AM</span>
                    </div>
                </div>

                {/* Spacer to avoid being hidden behind floated input */}
                <div className="h-10"></div>

            </div>

            {/* Chat Input Floating WhatsApp Style */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end gap-2">
                <div className="flex-1 flex items-center bg-white dark:bg-stone-800 px-2 py-1 rounded-3xl shadow-md border border-gray-200 dark:border-stone-700 min-h-[50px]">
                    <button className="p-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors rounded-full">
                        <Smile className="h-6 w-6" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors rounded-full">
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <textarea
                        placeholder="Escribe un mensaje"
                        className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none py-3 px-2 overflow-y-auto"
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />

                    <button className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hidden sm:block">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    </button>
                </div>

                {/* Voice/Send button */}
                <button className="bg-[var(--color-accent)] hover:bg-[#829965] text-white p-3.5 rounded-full shadow-md transition-transform active:scale-95 flex-shrink-0 flex items-center justify-center h-[50px] w-[50px]">
                    <Mic className="h-6 w-6" />
                </button>
            </div>

        </div>
    );
}
