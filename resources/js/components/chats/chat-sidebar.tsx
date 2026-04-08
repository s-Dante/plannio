import { useState, useMemo } from 'react';
import { Search, Users, UserRound, MoreVertical, UserPlus, MessageSquarePlus, Clock, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';

const styles = {
    sidebarBase: "w-80 h-full flex flex-col bg-white dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 z-10",
    headerContainer: "p-6 pb-2 flex flex-col border-b border-transparent",
    headerTitleBox: "flex items-center justify-between",
    headerTitle: "text-2xl font-extrabold text-[#0D304A] dark:text-gray-100",
    moreOptionsBtn: "h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 text-[var(--color-sisth)] flex items-center justify-center transition-colors cursor-pointer",
    
    dropdownContent: "w-56 rounded-2xl border-gray-100 shadow-lg p-2 font-medium text-[var(--color-sisth)]",
    dropdownItem: "rounded-xl cursor-pointer py-2.5 focus:bg-[var(--color-accent)]/10 focus:text-[var(--color-accent)] flex items-center gap-2",
    dropdownIcon: "h-4 w-4",

    tabContainer: "flex gap-4 mt-4 border-b border-gray-100 dark:border-stone-800",
    tabBtn: "pb-2 text-sm font-bold transition-colors relative",
    tabActive: "text-[var(--color-accent)] border-none",
    tabInactive: "text-gray-400 hover:text-gray-600",
    activeIndicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-t-full",

    searchContainer: "px-4 pt-4 pb-2 border-transparent",
    searchInputWrapper: "relative",
    searchIcon: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-sisth)]/50 font-bold",
    searchInput: "pl-10 bg-[#f6f7f9] dark:bg-stone-800 border-transparent focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] rounded-2xl h-11 text-sm font-medium placeholder:text-[var(--color-sisth)]/40 shadow-inner",

    listContainer: "flex-1 overflow-y-auto px-3 space-y-1 py-1 custom-scrollbar",
    
    itemBase: "w-full flex items-center gap-4 p-3 rounded-2xl text-left border transition-all mb-2 cursor-pointer outline-none relative",
    itemInactive: "hover:bg-gray-50 dark:hover:bg-stone-800/50 border-transparent",
    
    avatarWrapper: "relative shrink-0",
    avatarImage: "h-12 w-12 rounded-full object-cover border border-gray-100 dark:border-stone-700",
    
    textWrapper: "flex-1 overflow-hidden flex flex-col justify-center",
    nameTitle: "font-bold text-[#0D304A] dark:text-gray-100 truncate text-[15px]",
    badgeIndicator: "absolute right-[-6px] top-[-6px] bg-red-500 text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-stone-900"
};

export function ChatSidebar({ onOpenSearch, onOpenNewGroup, groups, pendingRequests }: any) {
    const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
    const [searchLocal, setSearchLocal] = useState('');
    const { auth } = usePage<any>().props;

    const filteredGroups = useMemo(() => {
        if(!groups) return [];
        return groups.filter((g: any) => g.name.toLowerCase().includes(searchLocal.toLowerCase()));
    }, [groups, searchLocal]);

    const acceptRequest = (friendId: number) => {
        router.post('/chats/accept', { friend_id: friendId }, {
            onSuccess: () => toast.success("Amistad aceptada! Chat creado.")
        });
    };

    return (
        <div className={styles.sidebarBase}>
            <div className={styles.headerContainer}>
                <div className={styles.headerTitleBox}>
                    <h2 className={styles.headerTitle}>Mensajes</h2>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={styles.moreOptionsBtn}>
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={styles.dropdownContent}>
                            <DropdownMenuItem className={styles.dropdownItem} onClick={onOpenNewGroup}>
                                <MessageSquarePlus className={styles.dropdownIcon} />
                                Nuevo Chat Grupal
                            </DropdownMenuItem>
                            <DropdownMenuItem className={styles.dropdownItem} onClick={onOpenSearch}>
                                <UserPlus className={styles.dropdownIcon} />
                                Buscar Amigos
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className={styles.tabContainer}>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'chats' ? styles.tabActive : styles.tabInactive}`} 
                        onClick={() => setActiveTab('chats')}
                    >
                        Mis Chats
                        {activeTab === 'chats' && <div className={styles.activeIndicator} />}
                    </button>
                    <button 
                        className={`${styles.tabBtn} ${activeTab === 'requests' ? styles.tabActive : styles.tabInactive}`} 
                        onClick={() => setActiveTab('requests')}
                    >
                        Solicitudes
                        {pendingRequests?.length > 0 && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full relative -top-0.5">{pendingRequests.length}</span>
                        )}
                        {activeTab === 'requests' && <div className={styles.activeIndicator} />}
                    </button>
                </div>
            </div>

            {activeTab === 'chats' && (
                <>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchInputWrapper}>
                            <Search className={styles.searchIcon} />
                            <Input
                                placeholder="Buscar en tus chats..."
                                className={styles.searchInput}
                                value={searchLocal}
                                onChange={e => setSearchLocal(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.listContainer}>
                        {filteredGroups.length === 0 ? (
                            <div className="text-center p-6 text-gray-400 mt-4">
                                <MessageSquarePlus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No tienes chats activos.</p>
                            </div>
                        ) : (
                            filteredGroups.map((group: any) => (
                                <button key={group.id} className={`${styles.itemBase} ${styles.itemInactive}`}>
                                    <div className={styles.avatarWrapper}>
                                        <img src={group.avatar || `https://ui-avatars.com/api/?name=${group.name}&background=random`} className={styles.avatarImage} alt="Avatar" />
                                    </div>
                                    <div className={styles.textWrapper}>
                                        <span className={styles.nameTitle}>{group.name}</span>
                                        <span className="text-xs text-gray-500 truncate mt-0.5">{group.is_individual ? "Chat Privado" : `${group.members.length} miembros`}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}

            {activeTab === 'requests' && (
                <div className={styles.listContainer}>
                    <div className="pt-4">
                        {(!pendingRequests || pendingRequests.length === 0) ? (
                            <div className="text-center p-6 text-gray-400 mt-4">
                                <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No tienes solicitudes pendientes.</p>
                            </div>
                        ) : (
                            pendingRequests.map((req: any) => (
                                <div key={req.id} className="w-full flex-col p-3 rounded-2xl bg-gray-50 dark:bg-stone-800/60 mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={req.sender?.avatar || `https://ui-avatars.com/api/?name=${req.sender?.name}`} className="h-10 w-10 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold">{req.sender?.name}</p>
                                            <p className="text-xs text-gray-500">@{req.sender?.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={() => acceptRequest(req.sender?.id)} className="flex-1 bg-[var(--color-accent)] hover:bg-[#829965] text-white py-1.5 rounded-lg text-xs font-bold transition">Aceptar</button>
                                        <button className="flex-1 bg-gray-200 dark:bg-stone-700 text-gray-700 dark:text-gray-300 py-1.5 rounded-lg text-xs font-bold transition">Rechazar</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
