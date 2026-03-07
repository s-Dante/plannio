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
    { id: 1, name: 'Fundador', color: 'bg-red-600', active: true },
    { id: 2, name: 'Pionero', color: 'bg-sky-600', active: true },
    { id: 3, name: '100 Días', color: 'bg-green-500', active: false },
    { id: 4, name: 'Top 10%', color: 'bg-amber-500', active: false },
    { id: 5, name: 'Beta Tester', color: 'bg-purple-300', active: false },
];

const MOCK_FRAMES = [
    { id: 1, name: 'Sin Marco', image: null, active: false },
    { id: 2, name: 'Cactus', image: '/imgs/frames/Cactus.png', active: true },
    { id: 3, name: 'Maracas', image: '/imgs/frames/Maracas.png', active: false },
    { id: 4, name: 'Papel Picado', image: '/imgs/frames/PapelPicado.png', active: false },
    { id: 5, name: 'Sombrero', image: '/imgs/frames/Sombrero.png', active: false },
];

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
    const getInitials = useInitials();
    const userName = 'Omar Fernandez';
    const userAvatar = '/imgs/assets/wc-balls/1950.png';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[90vw] md:max-w-[45vw] overflow-y-auto max-h-[90vh] p-0 border border-gray-200 dark:border-stone-800 rounded-lg shadow-xl bg-white dark:bg-[#111214]">
                <DialogHeader className="p-5 pb-3 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-[#111214]">
                    <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                        <Gift className="h-5 w-5 text-zinc-800" />
                        Tus Recompensas
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Administra y previsualiza los marcos e insignias de tu perfil.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-8 bg-white dark:bg-[#111214]">
                    {/* Preview Area */}
                    <section className="flex flex-col md:flex-row items-center gap-6 justify-center">
                        <div className="flex items-center gap-6 p-4 rounded-lg bg-gray-50 flex-1 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800 w-full justify-center md:justify-start shadow-sm">

                            {/* Avatar Wrapper with PNG Frame overlay */}
                            <div className="relative flex items-center justify-center">
                                {/* The Avatar itself */}
                                <Avatar className="h-20 w-20 rounded-full border border-gray-200 dark:border-stone-700 bg-white dark:bg-[#111214] z-0">
                                    <AvatarImage src={userAvatar} alt={userName} className="object-cover" />
                                    <AvatarFallback className="text-xl rounded-full bg-primary/10 text-primary">
                                        {getInitials(userName)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Active Frame Image overlaying the avatar */}
                                {MOCK_FRAMES.find(f => f.active)?.image && (
                                    <img
                                        src={MOCK_FRAMES.find(f => f.active)?.image as string}
                                        alt="Active Frame"
                                        className="absolute z-10 pointer-events-none scale-125 object-contain"
                                        style={{ width: '135%', height: '135%' }}
                                    />
                                )}
                            </div>

                            {/* Active Badges next to avatar */}
                            <div className="flex flex-col gap-2 z-10">
                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{userName}</div>
                                <div className="flex flex-wrap gap-2">
                                    {MOCK_BADGES.filter(b => b.active).map(badge => (
                                        <div
                                            key={badge.id}
                                            className={`px-3 py-1 text-xs font-bold text-white rounded-md ${badge.color} shadow-sm border border-black/10 cursor-default`}
                                        >
                                            {badge.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Emblemas / Text Badges */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-zinc-800" />
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Insignias</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {MOCK_BADGES.map((badge: any) => (
                                    <div
                                        key={badge.id}
                                        className={`relative flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all ${badge.active
                                            ? 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30'
                                            : 'bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800'
                                            }`}
                                    >
                                        {badge.active && (
                                            <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-indigo-500 text-white rounded-md flex items-center justify-center text-[10px] shadow-sm z-10">
                                                ✓
                                            </div>
                                        )}
                                        <div className={`px-3 py-1 text-xs font-bold text-white rounded-md shadow-sm border border-black/10 ${badge.active ? badge.color : `${badge.color} opacity-40 grayscale`
                                            }`}>
                                            {badge.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Marcos / Frames PNGs */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Frame className="h-5 w-5 text-zinc-800" />
                                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Marcos</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {MOCK_FRAMES.map((frame: any) => (
                                    <div
                                        key={frame.id}
                                        className={`relative flex flex-col items-center justify-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${frame.active
                                            ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30'
                                            : 'bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800'
                                            }`}
                                    >
                                        {frame.active && (
                                            <div className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 text-white rounded-md flex items-center justify-center text-[10px] shadow-sm z-10">
                                                ✓
                                            </div>
                                        )}

                                        <div className="relative flex items-center justify-center h-14 w-14">
                                            {/* Static small avatar to preview the frame */}
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-stone-800 flex items-center justify-center z-0">
                                                <span className="text-[10px] text-gray-400 font-medium">Yo</span>
                                            </div>

                                            {frame.image && (
                                                <img
                                                    src={frame.image}
                                                    alt={frame.name}
                                                    className={`absolute z-10 pointer-events-none scale-[1.3] object-contain ${!frame.active && 'opacity-50 grayscale'
                                                        }`}
                                                    style={{ width: '130%', height: '130%' }}
                                                />
                                            )}
                                        </div>

                                        <span className={`text-[10px] text-center font-medium ${frame.active ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {frame.name}
                                        </span>
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
