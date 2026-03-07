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

// Mock user data for the mockup
const MOCK_USER = {
    name: 'Omar Fernandez',
    username: '@omarfer #',
    email: 'omar@example.com',
    avatar: '/imgs/assets/wc-balls/1950.png', // Usando la imagen del balón
    coverColor: 'bg-indigo-500', // Color sólido de portada
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

    // Cierra el modal si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if clicking on the toggle button inside floating-sidebar
            // We assume the button has some identifying trait, or we just rely on event bubbling.
            // Since it's a mockup, simple click outside logic is usually fine.
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Need a slight delay to avoid closing immediately on trigger click
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
            className="absolute left-[85px] md:left-[96px] top-[140px] z-[9999] w-72 md:w-80 overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-[#111214] border border-gray-200 dark:border-stone-800 animate-in fade-in slide-in-from-left-4 duration-200"
        >
            {/* Cover Image/Color Area */}
            <div className={`h-24 w-full relative ${MOCK_USER.coverColor}`}>
                {/* Theme Switcher Top Right */}
                <div className="absolute top-3 right-3 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm border-none shadow-sm"
                            >
                                {theme === 'light' ? (
                                    <Sun className="h-3.5 w-3.5" />
                                ) : theme === 'dark' ? (
                                    <Moon className="h-3.5 w-3.5" />
                                ) : (
                                    <Monitor className="h-3.5 w-3.5" />
                                )}
                                <span className="sr-only">Cambiar tema</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl mt-1 z-[10000]">
                            <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer rounded-lg text-sm">
                                <Sun className="mr-2 h-4 w-4" />
                                <span>Claro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer rounded-lg text-sm">
                                <Moon className="mr-2 h-4 w-4" />
                                <span>Oscuro</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer rounded-lg text-sm">
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>Sistema</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="px-5 pb-5 pt-0 relative">
                {/* Avatar positioned halfway across the cover */}
                <div className="flex justify-between items-end -mt-10 mb-3">
                    <div className="p-1.5 bg-white dark:bg-[#111214] rounded-full relative z-10 shadow-sm border border-gray-100 dark:border-transparent">
                        <Avatar className="h-16 w-16 rounded-full border-0">
                            <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} className="object-cover" />
                            <AvatarFallback className="text-xl rounded-full bg-primary/10 text-primary">
                                {getInitials(MOCK_USER.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* User Info (Discord style) */}
                <div className="space-y-0.5 mb-5 px-1">
                    <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        {MOCK_USER.name}
                    </h2>
                    <div className="flex items-center text-sm">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">{MOCK_USER.username}</span>
                    </div>
                </div>

                {/* Actions Box */}
                <div className="space-y-1 bg-gray-50 dark:bg-[#2b2d31] p-2 rounded-xl border border-gray-100 dark:border-stone-800">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start rounded-lg hover:bg-gray-200 dark:hover:bg-[#313338] text-gray-700 dark:text-gray-200 border-none py-4 text-xs font-semibold"
                    >
                        <Link href="/settings/profile" onClick={onClose}>
                            <Settings className="h-4 w-4 mr-2 text-gray-500" />
                            Editar perfil
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start rounded-lg hover:bg-gray-200 dark:hover:bg-[#313338] text-gray-700 dark:text-gray-200 border-none py-4 text-xs font-semibold"
                        onClick={() => {
                            onClose();
                            if (onOpenRewards) onOpenRewards();
                        }}
                    >
                        <Gift className="h-4 w-4 mr-2 text-violet-500 dark:text-violet-400" />
                        Recompensas
                    </Button>
                </div>
            </div>
        </div>
    );
}
