import { Search, Users, UserRound, MoreVertical, UserPlus, MessageSquarePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatSidebar() {
    return (
        <div className="w-80 h-full flex flex-col bg-white dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 z-10">
            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between border-b border-transparent">
                <h2 className="text-2xl font-extrabold text-[#0D304A] dark:text-gray-100">Mensajes</h2>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 text-[var(--color-sisth)] flex items-center justify-center transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gray-100 shadow-lg p-2 font-medium text-[var(--color-sisth)]">
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] flex items-center gap-2">
                            <MessageSquarePlus className="h-4 w-4" />
                            Nuevo Chat Grupal
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl cursor-pointer py-2.5 focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Buscar Amigos
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Search */}
            <div className="px-4 pb-4 border-b border-gray-100 dark:border-stone-800">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-sisth)]/50 font-bold" />
                    <Input
                        placeholder="Buscar chats o personas..."
                        className="pl-10 bg-[#f6f7f9] dark:bg-stone-800 border-transparent focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] rounded-2xl h-11 text-sm font-medium placeholder:text-[var(--color-sisth)]/40 shadow-inner"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-3 space-y-1 py-3 custom-scrollbar">

                {/* Mock item - Group (Active) */}
                <button className="w-full flex items-center gap-4 p-3 rounded-2xl bg-[#e6eceb]/60 dark:bg-stone-800 text-left border border-[var(--color-accent)]/20 transition-all mb-2">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border-2 border-[var(--color-accent)]/30 bg-gray-100 text-purple-600 flex items-center justify-center">
                            <Users className="h-6 w-6" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[#0D304A] dark:text-gray-100 truncate">Mundial MTY 2026</span>
                            <span className="text-[10px] font-bold text-[var(--color-accent)] whitespace-nowrap">10:42 AM</span>
                        </div>
                        <p className="text-xs text-[var(--color-sisth)]/70 truncate font-semibold">Ana: ¡Perfecto! Nos vemos en...</p>
                    </div>
                    {/* Unread Badge */}
                    <div className="h-5 w-5 bg-[var(--color-accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        2
                    </div>
                </button>

                {/* Mock item - User */}
                <button className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-stone-800/50 text-left border border-transparent transition-all">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <UserRound className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[#0D304A] dark:text-gray-200 truncate">Luis Fernando</span>
                            <span className="text-[10px] text-[var(--color-sisth)]/50 whitespace-nowrap">Ayer</span>
                        </div>
                        <p className="text-xs text-[var(--color-sisth)]/60 truncate">¿A qué hora empieza la junta?</p>
                    </div>
                </button>

                {/* Mock item - Group */}
                <button className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-stone-800/50 text-left border border-transparent transition-all">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold text-[#0D304A] dark:text-gray-200 truncate">Viaje a Cancún</span>
                            <span className="text-[10px] text-[var(--color-sisth)]/50 whitespace-nowrap">Lun</span>
                        </div>
                        <p className="text-xs text-[var(--color-sisth)]/60 truncate font-medium">Carlos: Ya quedaron los boletos.</p>
                    </div>
                </button>

            </div>
        </div>
    );
}
