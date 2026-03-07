import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Settings, Gift, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const styles = {
    modalWrapper: "absolute left-[85px] md:left-[96px] top-[90px] z-[9999] w-64 md:w-72 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-[#111214] border border-gray-200 dark:border-stone-800 animate-in fade-in slide-in-from-left-4 duration-200",
    coverContainerBase: "h-24 w-full relative",
    themeSwitcherContainer: "absolute top-3 right-3 z-10",
    themeSwitcherButton: "h-7 w-7 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm border-none shadow-sm",
    themeIcon: "h-3.5 w-3.5",
    themeMenuContent: "rounded-xl mt-1 z-[10000]",
    themeMenuItem: "cursor-pointer rounded-lg text-sm",
    themeMenuIcon: "mr-2 h-4 w-4",
    srOnly: "sr-only",

    bodyContainer: "px-5 pb-5 pt-0 relative",
    avatarWrapper: "flex justify-between items-end -mt-10 mb-3",
    avatarBackground: "p-1.5 bg-white dark:bg-[#111214] rounded-full relative z-10 shadow-sm border border-gray-100 dark:border-transparent",
    avatarBase: "h-16 w-16 rounded-full border-0",
    avatarImage: "object-cover",
    avatarFallback: "text-xl rounded-full bg-primary/10 text-primary",

    userInfoContainer: "space-y-0.5 mb-5 px-1",
    userName: "text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100",
    userHandleContainer: "flex items-center text-sm",
    userHandle: "font-semibold text-gray-500 dark:text-gray-400",

    actionsContainer: "space-y-1 bg-gray-50 dark:bg-[#2b2d31] p-2 rounded-xl border border-gray-100 dark:border-stone-800",
    actionButtonBase: "w-full justify-start rounded-lg hover:bg-gray-200 dark:hover:bg-[#313338] text-gray-700 dark:text-gray-200 border-none py-4 text-xs font-semibold",
    actionIconSettings: "h-4 w-4 mr-2 text-gray-500",
    actionIconRewards: "h-4 w-4 mr-2 text-violet-500 dark:text-violet-400"
};

const MOCK_USER = {
    name: 'Omar Fernandez',
    username: '@omarfer #',
    email: 'omar@example.com',
    avatar: '/imgs/assets/wc-balls/1950.png',
    coverColor: 'bg-indigo-500',
};

interface UserCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRewards?: () => void;
}

export function UserCardModal({ isOpen, onClose, onOpenRewards }: UserCardModalProps) {
    const getInitials = useInitials();
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside);
            }, 0);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={styles.modalWrapper}
        >
            <div className={`${styles.coverContainerBase} ${MOCK_USER.coverColor}`}>
                <div className={styles.themeSwitcherContainer}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={styles.themeSwitcherButton}
                            >
                                {theme === 'light' ? (
                                    <Sun className={styles.themeIcon} />
                                ) : theme === 'dark' ? (
                                    <Moon className={styles.themeIcon} />
                                ) : (
                                    <Monitor className={styles.themeIcon} />
                                )}
                                <span className={styles.srOnly}>Cambiar tema</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={styles.themeMenuContent} onPointerDownCapture={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => setTheme('light')} className={styles.themeMenuItem}>
                                <Sun className={styles.themeMenuIcon} />
                                <span>Claro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')} className={styles.themeMenuItem}>
                                <Moon className={styles.themeMenuIcon} />
                                <span>Oscuro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')} className={styles.themeMenuItem}>
                                <Monitor className={styles.themeMenuIcon} />
                                <span>Sistema</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className={styles.bodyContainer}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatarBackground}>
                        <Avatar className={styles.avatarBase}>
                            <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} className={styles.avatarImage} />
                            <AvatarFallback className={styles.avatarFallback}>
                                {getInitials(MOCK_USER.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className={styles.userInfoContainer}>
                    <h2 className={styles.userName}>
                        {MOCK_USER.name}
                    </h2>
                    <div className={styles.userHandleContainer}>
                        <span className={styles.userHandle}>{MOCK_USER.username}</span>
                    </div>
                </div>

                <div className={styles.actionsContainer}>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className={styles.actionButtonBase}
                    >
                        <Link href="/settings/profile" onClick={onClose}>
                            <Settings className={styles.actionIconSettings} />
                            Editar perfil
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className={styles.actionButtonBase}
                        onClick={() => {
                            onClose();
                            if (onOpenRewards) onOpenRewards();
                        }}
                    >
                        <Gift className={styles.actionIconRewards} />
                        Recompensas
                    </Button>
                </div>
            </div>
        </div>
    );
}
