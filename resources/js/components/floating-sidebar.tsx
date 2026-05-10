import { Link, usePage } from '@inertiajs/react';
import {
    Map,
    MessageSquare,
    ClipboardList,
    Gift,
    LogOut,
    User,
} from 'lucide-react';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useState } from 'react';
import { UserCardModal } from './user-card-modal';
import { RewardsModal } from './rewards-modal';

const styles = {
    sidebarBase: [
        "flex w-full h-16 flex-row items-center justify-around",
        "border-t border-gray-200 dark:border-stone-800",
        "bg-white dark:bg-stone-900/95 backdrop-blur-md",
        "px-2",
        "md:w-20 md:h-full md:flex-col md:justify-between",
        "md:border-t-0 md:border-r",
        "md:bg-gray-100/80 md:dark:bg-stone-900/80",
        "md:py-6 md:px-0",
    ].join(' '),

    logoContainer: "hidden md:flex h-12 w-12 items-center justify-center transition-transform hover:scale-105",
    logoImageLight: "w-full h-full object-contain dark:hidden",
    logoImageDark: "w-full h-full object-contain hidden dark:block",
    topSection: "flex md:flex-col items-center gap-1 md:gap-6",
    navContainer: "flex flex-row md:flex-col items-center gap-1 md:gap-4 md:mt-4",

    linkBase: "relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer",
    linkActive: "bg-white shadow-sm dark:bg-stone-800 text-primary",
    linkInactive: "text-gray-500 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-stone-800/50",

    activeIndicator: "absolute left-0 top-1/2 -mt-3 h-6 w-1 rounded-r-full bg-primary md:block hidden",
    activeIndicatorMobile: "absolute bottom-0 left-1/2 -ml-3 w-6 h-1 rounded-t-full bg-primary md:hidden",
    iconSize: "h-6 w-6",

    bottomSection: "hidden md:flex flex-col items-center",
    logoutButton: "flex h-12 w-12 items-center justify-center rounded-2xl text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors",
    logoutIcon: "h-6 w-6 ml-1",
    tooltipLogout: "font-semibold text-red-500 bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 shadow-md",
    tooltipRegular: "font-semibold bg-white dark:bg-stone-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-stone-700 shadow-md",
};

export function FloatingSidebar() {
    const { url } = usePage();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isRewardsOpen, setIsRewardsOpen] = useState(false);

    const navItems = [
        { name: 'Perfil', icon: User, href: '#', isModal: true, modalType: 'profile' },
        { name: 'Mapa', icon: Map, href: '/map' },
        { name: 'Chats', icon: MessageSquare, href: '/chats' },
        { name: 'Tareas', icon: ClipboardList, href: '/tasks' },
        { name: 'Recompensas', icon: Gift, href: '#', isModal: true, modalType: 'rewards' },
    ];

    const handleModalOpen = (modalType: string) => {
        if (modalType === 'profile') setIsProfileOpen(true);
        if (modalType === 'rewards') setIsRewardsOpen(true);
    };

    return (
        <aside className={styles.sidebarBase}>

            <div className={styles.topSection}>
                <Link href="/" className={styles.logoContainer}>
                    <img src="/imgs/logos/Pin_Black_new.PNG" alt="Plannio Icon" className={styles.logoImageLight} />
                    <img src="/imgs/logos/Pin_White_new.PNG" alt="Plannio Icon" className={styles.logoImageDark} />
                </Link>

                <TooltipProvider delayDuration={0}>
                    <nav className={styles.navContainer}>
                        {navItems.map((item) => {
                            let isActive = false;
                            if (item.isModal) {
                                isActive = (item.modalType === 'profile' && isProfileOpen) || (item.modalType === 'rewards' && isRewardsOpen);
                            } else {
                                isActive = url.startsWith(item.href);
                            }

                            const linkContent = (
                                <>
                                    {isActive && <span className={styles.activeIndicator} />}
                                    {isActive && <span className={styles.activeIndicatorMobile} />}
                                    <item.icon className={styles.iconSize} />
                                </>
                            );

                            const linkClasses = `${styles.linkBase} ${isActive ? styles.linkActive : styles.linkInactive}`;

                            return (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        {item.isModal ? (
                                            <button onClick={() => handleModalOpen(item.modalType!)} className={linkClasses}>
                                                {linkContent}
                                            </button>
                                        ) : (
                                            <Link href={item.href} className={linkClasses}>
                                                {linkContent}
                                            </Link>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className={styles.tooltipRegular}>
                                        {item.name}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className={`${styles.logoutButton} md:hidden`}
                                >
                                    <LogOut className="h-6 w-6" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="top" className={styles.tooltipLogout}>
                                Salir
                            </TooltipContent>
                        </Tooltip>
                    </nav>
                </TooltipProvider>
            </div>

            <UserCardModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onOpenRewards={() => setIsRewardsOpen(true)} />
            <RewardsModal isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />

            <div className={styles.bottomSection}>
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/logout" method="post" as="button" className={styles.logoutButton}>
                                <LogOut className={styles.logoutIcon} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className={styles.tooltipLogout}>
                            Salir
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </aside>
    );
}
