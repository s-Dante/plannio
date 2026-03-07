import { Search, Users, UserRound, MoreVertical, UserPlus, MessageSquarePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const styles = {
    // Layout
    sidebarBase: "w-80 h-full flex flex-col bg-white dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 z-10",

    // Header
    headerContainer: "p-6 pb-4 flex items-center justify-between border-b border-transparent",
    headerTitle: "text-2xl font-extrabold text-[#0D304A] dark:text-gray-100",
    moreOptionsBtn: "h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 text-[var(--color-sisth)] flex items-center justify-center transition-colors cursor-pointer",

    // Dropdown
    dropdownContent: "w-56 rounded-2xl border-gray-100 shadow-lg p-2 font-medium text-[var(--color-sisth)]",
    dropdownItem: "rounded-xl cursor-pointer py-2.5 focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] flex items-center gap-2",
    dropdownIcon: "h-4 w-4",

    // Search
    searchContainer: "px-4 pb-4 border-b border-gray-100 dark:border-stone-800",
    searchInputWrapper: "relative",
    searchIcon: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-sisth)]/50 font-bold",
    searchInput: "pl-10 bg-[#f6f7f9] dark:bg-stone-800 border-transparent focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] rounded-2xl h-11 text-sm font-medium placeholder:text-[var(--color-sisth)]/40 shadow-inner",

    // List
    listContainer: "flex-1 overflow-y-auto px-3 space-y-1 py-3 custom-scrollbar",

    // List Items Common
    itemBase: "w-full flex items-center gap-4 p-3 rounded-2xl text-left border transition-all mb-2 cursor-pointer",
    itemActive: "bg-[#e6eceb]/60 dark:bg-stone-800 border-[var(--color-accent)]/20",
    itemInactive: "hover:bg-gray-50 dark:hover:bg-stone-800/50 border-transparent",

    // Avatar
    avatarWrapper: "relative",
    avatarIconBoxGroup: "h-12 w-12 rounded-full border-2 border-[var(--color-accent)]/30 bg-gray-100 text-purple-600 flex items-center justify-center",
    avatarIconBoxUser1: "h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center",
    avatarIconBoxUser2: "h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center",
    avatarIcon: "h-6 w-6",

    // Text Content
    textWrapper: "flex-1 overflow-hidden flex flex-col justify-center",
    nameTitle: "font-bold text-[#0D304A] dark:text-gray-100 truncate text-lg",
};

export function ChatSidebar() {
    return (
        <div className={styles.sidebarBase}>
            {/* Header */}
            <div className={styles.headerContainer}>
                <h2 className={styles.headerTitle}>Mensajes</h2>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className={styles.moreOptionsBtn}>
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={styles.dropdownContent}>
                        <DropdownMenuItem className={styles.dropdownItem}>
                            <MessageSquarePlus className={styles.dropdownIcon} />
                            Nuevo Chat Grupal
                        </DropdownMenuItem>
                        <DropdownMenuItem className={styles.dropdownItem}>
                            <UserPlus className={styles.dropdownIcon} />
                            Buscar Amigos
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Search */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <Search className={styles.searchIcon} />
                    <Input
                        placeholder="Buscar chats o personas..."
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* List */}
            <div className={styles.listContainer}>

                {/* Mock item - Group (Active) */}
                <button className={`${styles.itemBase} ${styles.itemActive}`}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarIconBoxGroup}>
                            <Users className={styles.avatarIcon} />
                        </div>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.nameTitle}>Grupo 1</span>
                    </div>
                </button>

                {/* Mock item - User */}
                <button className={`${styles.itemBase} ${styles.itemInactive}`}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarIconBoxUser1}>
                            <UserRound className={styles.avatarIcon} />
                        </div>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.nameTitle}>Persona 1</span>
                    </div>
                </button>

                {/* Mock item - Group */}
                <button className={`${styles.itemBase} ${styles.itemInactive}`}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatarIconBoxUser2}>
                            <Users className={styles.avatarIcon} />
                        </div>
                    </div>
                    <div className={styles.textWrapper}>
                        <span className={styles.nameTitle}>Grupo 2</span>
                    </div>
                </button>

            </div>
        </div>
    );
}
