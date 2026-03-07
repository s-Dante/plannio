import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Gift, Award, Frame } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface RewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MOCK_BADGES = [
    { id: 1, name: 'Fundador', icon: '🏆', color: 'from-amber-200 to-orange-400', active: true },
    { id: 2, name: 'Pionero', icon: '🚀', color: 'from-cyan-300 to-blue-500', active: true },
    { id: 3, name: '100 Días', icon: '🔥', color: 'from-rose-400 to-red-600', active: false },
    { id: 4, name: 'Top 10%', icon: '⭐', color: 'from-purple-400 to-indigo-600', active: false },
    { id: 5, name: 'Beta Tester', icon: '🐛', color: 'from-emerald-300 to-green-500', active: false },
];

const MOCK_FRAMES = [
    { id: 1, name: 'Clásico', style: 'border-2 border-transparent', active: false },
    { id: 2, name: 'Neón', style: 'border-4 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]', active: true },
];

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
    const getInitials = useInitials();
    const userName = 'Omar Fernandez';
    const userAvatar = '/imgs/assets/wc-balls/1950.png';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-[60vw] overflow-y-auto max-h-[90vh] p-0 border-0 rounded-3xl shadow-2xl bg-white dark:bg-stone-950">
                <DialogHeader className="p-6 pb-2 border-b border-gray-100 dark:border-stone-800">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Gift className="h-6 w-6 text-violet-500" />
                        Tus Recompensas
                    </DialogTitle>
                    <DialogDescription>
                        Administra y previsualiza los marcos y emblemas de tu perfil.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 dark:bg-stone-950/50">
                    {/* Preview Area */}
                    <section className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-gray-100 dark:border-stone-800 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-center">
                        <div className="flex items-center gap-6 p-4 rounded-2xl bg-gray-50 dark:bg-stone-950/50 border border-gray-100 dark:border-stone-800/50 w-full justify-center md:justify-start">
                            {/* Avatar with active frame */}
                            <Avatar className={`h-24 w-24 rounded-full ${MOCK_FRAMES.find(f => f.active)?.style} bg-white dark:bg-[#111214]`}>
                                <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                                <AvatarFallback className="text-2xl rounded-full bg-primary/10 text-primary">
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Active Badges next to avatar */}
                            <div className="flex flex-col gap-2">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{userName}</div>
                                <div className="flex gap-2">
                                    {MOCK_BADGES.filter(b => b.active).map(badge => (
                                        <div key={badge.id} className="group relative">
                                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${badge.color} shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer border border-white/20`}>
                                                <span className="text-xl">{badge.icon}</span>
                                            </div>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {badge.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Emblemas / Badges */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Emblemas</h2>
                            </div>

                            <div className="grid grid-cols-4 gap-3">
                                {MOCK_BADGES.map(badge => (
                                    <div
                                        key={badge.id}
                                        className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all ${badge.active
                                                ? 'bg-primary/5 border-2 border-primary'
                                                : 'bg-white dark:bg-stone-900 border-2 border-transparent shadow-sm'
                                            }`}
                                    >
                                        {badge.active && (
                                            <div className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs border-2 border-white dark:border-stone-900 z-10">
                                                ✓
                                            </div>
                                        )}
                                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${badge.color} shadow-sm flex items-center justify-center border border-white/20`}>
                                            <span className="text-xl">{badge.icon}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Marcos / Frames */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Frame className="h-5 w-5 text-fuchsia-500" />
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Marcos</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {MOCK_FRAMES.map(frame => (
                                    <div
                                        key={frame.id}
                                        className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all ${frame.active
                                                ? 'bg-primary/5 border-2 border-primary'
                                                : 'bg-white dark:bg-stone-900 border-2 border-transparent shadow-sm'
                                            }`}
                                    >
                                        {frame.active && (
                                            <div className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs border-2 border-white dark:border-stone-900 z-10">
                                                ✓
                                            </div>
                                        )}
                                        <Avatar className={`h-14 w-14 rounded-full ${frame.style} bg-white dark:bg-[#111214]`}>
                                            <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                                            <AvatarFallback className="text-sm rounded-full bg-primary/10 text-primary">
                                                {getInitials(userName)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
