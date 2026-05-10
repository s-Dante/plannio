import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, usePage } from '@inertiajs/react';
import { Settings, Gift, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useAppearance } from '@/hooks/use-appearance';
import { SharedData } from '@/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const styles = {
    modalWrapper: "fixed left-4 bottom-[72px] md:left-[96px] md:bottom-auto md:top-[90px] z-[9999] w-[calc(100vw-2rem)] max-w-xs md:max-w-[18rem] overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-[#111214] border border-gray-200 dark:border-stone-800 animate-in fade-in zoom-in-95 duration-200",
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
    userHandleContainer: "flex items-center text-sm gap-2",
    userHandle: "font-semibold text-gray-500 dark:text-gray-400",
    badgesContainer: "flex flex-wrap gap-1.5 mt-2",
    badgeSticker: "h-5 w-5 rounded-sm object-contain",

    actionsContainer: "space-y-1 bg-gray-50 dark:bg-[#2b2d31] p-2 rounded-xl border border-gray-100 dark:border-stone-800",
    actionButtonBase: "w-full justify-start rounded-lg hover:bg-gray-200 dark:hover:bg-[#313338] text-gray-700 dark:text-gray-200 border-none py-4 text-xs font-semibold",
    actionIconSettings: "h-4 w-4 mr-2 text-gray-500",
    actionIconRewards: "h-4 w-4 mr-2 text-violet-500 dark:text-violet-400"
};

interface UserCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRewards?: () => void;
}

const BADGE_EMOJIS = ['🏅', '⚡', '🎯', '🔥', '💎', '🌟', '🦁', '🚀', '🎖️', '👑'];

const getBadgeEmoji = (name: string) => {
    return BADGE_EMOJIS[name.charCodeAt(0) % BADGE_EMOJIS.length];
};

export function UserCardModal({ isOpen, onClose, onOpenRewards }: UserCardModalProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const { appearance, updateAppearance } = useAppearance();
    const modalRef = useRef<HTMLDivElement>(null);

    const MOCK_USER = {
        name: auth?.user?.name || 'Invitado',
        username: auth?.user?.username || '@invitado',
        avatar: auth?.user?.avatar || '',
        coverColor: 'bg-indigo-500',
        frame: auth?.user?.equipped_frame,
        badges: auth?.user?.equipped_badges || [],
        points: auth?.user?.points || 0
    };

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

    return createPortal(
        <div
            ref={modalRef}
            className={styles.modalWrapper}
            onClick={(e) => e.stopPropagation()}
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
                                {appearance === 'light' ? (
                                    <Sun className={styles.themeIcon} />
                                ) : appearance === 'dark' ? (
                                    <Moon className={styles.themeIcon} />
                                ) : (
                                    <Monitor className={styles.themeIcon} />
                                )}
                                <span className={styles.srOnly}>Cambiar tema</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={styles.themeMenuContent} onPointerDownCapture={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); updateAppearance('light'); }} className={styles.themeMenuItem}>
                                <Sun className={styles.themeMenuIcon} />
                                <span>Claro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); updateAppearance('dark'); }} className={styles.themeMenuItem}>
                                <Moon className={styles.themeMenuIcon} />
                                <span>Oscuro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); updateAppearance('system'); }} className={styles.themeMenuItem}>
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
                        <div className="relative flex items-center justify-center">
                            <Avatar className={styles.avatarBase}>
                                {MOCK_USER.avatar ? (
                                    <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} className={styles.avatarImage} />
                                ) : null}
                                <AvatarFallback className={styles.avatarFallback}>
                                    {getInitials(MOCK_USER.name)}
                                </AvatarFallback>
                            </Avatar>

                            {MOCK_USER.frame && MOCK_USER.frame.image_url && !MOCK_USER.frame.image_url.startsWith('#') && (
                                <img
                                    src={MOCK_USER.frame.image_url}
                                    alt="Frame"
                                    className="absolute z-10 pointer-events-none object-contain"
                                    style={{ width: '135%', height: '135%', maxWidth: 'none' }}
                                />
                            )}
                            {MOCK_USER.frame && MOCK_USER.frame.image_url?.startsWith('#') && (
                                <div
                                    className="absolute z-10 w-[130%] h-[130%] rounded-full border-[5px] pointer-events-none shadow-sm"
                                    style={{ borderColor: MOCK_USER.frame.image_url }}
                                ></div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.userInfoContainer}>
                    <h2 className={styles.userName}>{MOCK_USER.name}</h2>
                    <div className={styles.userHandleContainer}>
                        <span className={styles.userHandle}>{MOCK_USER.username}</span>
                    </div>

                    {MOCK_USER.points > 0 && (
                        <div className="mt-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 px-2.5 py-1 rounded-full">
                                ⭐ {MOCK_USER.points.toLocaleString()} <span className="font-normal opacity-70">pts</span>
                            </span>
                        </div>
                    )}

                    {MOCK_USER.badges.length > 0 && (
                        <div className={styles.badgesContainer}>
                            {MOCK_USER.badges.map((badge: any) => (
                                badge.image_url?.startsWith('http') ? (
                                    <img key={badge.id} src={badge.image_url} alt={badge.name} title={badge.name} className={styles.badgeSticker} />
                                ) : (
                                    <span
                                        key={badge.id}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: badge.image_url?.startsWith('#') ? badge.image_url : '#6366f1' }}
                                        title={badge.name}
                                    >
                                        {getBadgeEmoji(badge.name)} {badge.name}
                                    </span>
                                )
                            ))}
                        </div>
                    )}
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
        </div>,
        document.body
    );
}
