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
        <aside className="flex w-16 md:w-20 flex-col items-center justify-between border-r border-gray-200 dark:border-stone-800 bg-gray-100/80 dark:bg-stone-900/80 py-6">
            <div className="flex flex-col items-center gap-6">
                {/* Logo or Main App Icon Placeholder */}
                <div className="h-10 w-10 rounded-xl bg-primary shadow-sm flex items-center justify-center text-primary-foreground font-bold text-xl">
                    P
                </div>

                <TooltipProvider delayDuration={0}>
                    <nav className="flex flex-col items-center gap-4 mt-4">
                        {navItems.map((item) => {
                            let isActive = false;

                            if (item.isModal) {
                                isActive = (item.modalType === 'profile' && isProfileOpen) || (item.modalType === 'rewards' && isRewardsOpen);
                            } else {
                                isActive = url.startsWith(item.href);
                            }

                            const linkContent = (
                                <>
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 -mt-3 h-6 w-1 rounded-r-full bg-primary" />
                                    )}
                                    <item.icon className="h-6 w-6" />
                                </>
                            );

                            const linkClasses = `relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${isActive
                                ? 'bg-white shadow-sm dark:bg-stone-800 text-primary'
                                : 'text-gray-500 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-stone-800/50'
                                }`;

                            return (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        {item.isModal ? (
                                            <button
                                                onClick={() => handleModalOpen(item.modalType!)}
                                                className={linkClasses}
                                            >
                                                {linkContent}
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={linkClasses}
                                            >
                                                {linkContent}
                                            </Link>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-semibold">
                                        {item.name}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </nav>
                </TooltipProvider>
            </div>

            {/* Modals */}
            <UserCardModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onOpenRewards={() => setIsRewardsOpen(true)} />
            <RewardsModal isOpen={isRewardsOpen} onClose={() => setIsRewardsOpen(false)} />

            {/* Bottom Actions (Logout) */}
            <div className="flex flex-col items-center">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex h-12 w-12 items-center justify-center rounded-2xl text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                            >
                                <LogOut className="h-6 w-6 ml-1" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-semibold text-red-500">
                            Salir
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </aside>
    );
}
