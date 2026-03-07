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

const styles = {
    dialogContent: "max-w-[90vw] md:max-w-[45vw] overflow-y-auto max-h-[90vh] p-0 border border-gray-200 dark:border-stone-800 rounded-lg shadow-xl bg-white dark:bg-[#111214]",
    dialogHeader: "p-5 pb-3 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-[#111214]",
    dialogTitle: "flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100",
    headerIcon: "h-5 w-5 text-zinc-800",
    dialogDescription: "text-sm",

    bodyContainer: "p-6 space-y-8 bg-white dark:bg-[#111214]",

    previewSection: "flex flex-col md:flex-row items-center gap-6 justify-center",
    previewCard: "flex items-center gap-6 p-4 rounded-lg bg-gray-50 flex-1 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800 w-full justify-center md:justify-start shadow-sm",

    avatarWrapper: "relative flex items-center justify-center",
    avatar: "h-20 w-20 rounded-full border border-gray-200 dark:border-stone-700 bg-white dark:bg-[#111214] z-0",
    avatarImage: "object-cover",
    avatarFallback: "text-xl rounded-full bg-primary/10 text-primary",
    frameImageOverlay: "absolute z-10 pointer-events-none scale-125 object-contain",

    previewUserDetails: "flex flex-col gap-2 z-10",
    previewUserName: "text-lg font-bold text-gray-900 dark:text-gray-100",
    previewBadgesContainer: "flex flex-wrap gap-2",
    previewBadgeItem: "px-3 py-1 text-xs font-bold text-white rounded-md shadow-sm border border-black/10 cursor-default",

    gridsContainer: "grid grid-cols-1 md:grid-cols-2 gap-8",

    sectionBase: "space-y-4",
    sectionHeader: "flex items-center gap-2",
    sectionTitle: "text-base font-bold text-gray-900 dark:text-gray-100",

    badgesGrid: "grid grid-cols-2 gap-3",
    badgeCardBase: "relative flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all",
    badgeCardActive: "bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30",
    badgeCardInactive: "bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800",
    checkIndicatorSmall: "absolute -top-1.5 -right-1.5 h-4 w-4 bg-indigo-500 text-white rounded-md flex items-center justify-center text-[10px] shadow-sm z-10",
    badgeLabelBase: "px-3 py-1 text-xs font-bold text-white rounded-md shadow-sm border border-black/10",

    framesGrid: "grid grid-cols-3 gap-3",
    frameCardBase: "relative flex flex-col items-center justify-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
    frameCardActive: "bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30",
    frameCardInactive: "bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800",
    frameCheckIndicator: "absolute -top-1.5 -right-1.5 h-4 w-4 bg-emerald-500 text-white rounded-md flex items-center justify-center text-[10px] shadow-sm z-10",
    framePreviewWrapper: "relative flex items-center justify-center h-14 w-14",
    framePreviewAvatar: "h-10 w-10 rounded-full bg-gray-200 dark:bg-stone-800 flex items-center justify-center z-0",
    framePreviewAvatarText: "text-[10px] text-gray-400 font-medium",
    framePreviewImage: "absolute z-10 pointer-events-none scale-[1.3] object-contain",
    frameLabel: "text-[10px] text-center font-medium",
    frameLabelActive: "text-emerald-700 dark:text-emerald-400",
    frameLabelInactive: "text-gray-500 dark:text-gray-400"
};

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
            <DialogContent className={styles.dialogContent}>
                <DialogHeader className={styles.dialogHeader}>
                    <DialogTitle className={styles.dialogTitle}>
                        <Gift className={styles.headerIcon} />
                        Tus Recompensas
                    </DialogTitle>
                    <DialogDescription className={styles.dialogDescription}>
                        Administra y previsualiza los marcos e insignias de tu perfil.
                    </DialogDescription>
                </DialogHeader>

                <div className={styles.bodyContainer}>
                    <section className={styles.previewSection}>
                        <div className={styles.previewCard}>

                            <div className={styles.avatarWrapper}>
                                <Avatar className={styles.avatar}>
                                    <AvatarImage src={userAvatar} alt={userName} className={styles.avatarImage} />
                                    <AvatarFallback className={styles.avatarFallback}>
                                        {getInitials(userName)}
                                    </AvatarFallback>
                                </Avatar>

                                {MOCK_FRAMES.find(f => f.active)?.image && (
                                    <img
                                        src={MOCK_FRAMES.find(f => f.active)?.image as string}
                                        alt="Active Frame"
                                        className={styles.frameImageOverlay}
                                        style={{ width: '135%', height: '135%' }}
                                    />
                                )}
                            </div>

                            <div className={styles.previewUserDetails}>
                                <div className={styles.previewUserName}>{userName}</div>
                                <div className={styles.previewBadgesContainer}>
                                    {MOCK_BADGES.filter(b => b.active).map(badge => (
                                        <div
                                            key={badge.id}
                                            className={`${styles.previewBadgeItem} ${badge.color}`}
                                        >
                                            {badge.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className={styles.gridsContainer}>
                        <section className={styles.sectionBase}>
                            <div className={styles.sectionHeader}>
                                <Award className={styles.headerIcon} />
                                <h2 className={styles.sectionTitle}>Insignias</h2>
                            </div>

                            <div className={styles.badgesGrid}>
                                {MOCK_BADGES.map((badge: any) => (
                                    <div
                                        key={badge.id}
                                        className={`${styles.badgeCardBase} ${badge.active ? styles.badgeCardActive : styles.badgeCardInactive
                                            }`}
                                    >
                                        {badge.active && (
                                            <div className={styles.checkIndicatorSmall}>✓</div>
                                        )}
                                        <div className={`${styles.badgeLabelBase} ${badge.active ? badge.color : `${badge.color} opacity-40 grayscale`}`}>
                                            {badge.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.sectionBase}>
                            <div className={styles.sectionHeader}>
                                <Frame className={styles.headerIcon} />
                                <h2 className={styles.sectionTitle}>Marcos</h2>
                            </div>

                            <div className={styles.framesGrid}>
                                {MOCK_FRAMES.map((frame: any) => (
                                    <div
                                        key={frame.id}
                                        className={`${styles.frameCardBase} ${frame.active ? styles.frameCardActive : styles.frameCardInactive
                                            }`}
                                    >
                                        {frame.active && (
                                            <div className={styles.frameCheckIndicator}>✓</div>
                                        )}

                                        <div className={styles.framePreviewWrapper}>
                                            <div className={styles.framePreviewAvatar}>
                                                <span className={styles.framePreviewAvatarText}>Yo</span>
                                            </div>

                                            {frame.image && (
                                                <img
                                                    src={frame.image}
                                                    alt={frame.name}
                                                    className={`${styles.framePreviewImage} ${!frame.active && 'opacity-50 grayscale'}`}
                                                    style={{ width: '130%', height: '130%' }}
                                                />
                                            )}
                                        </div>

                                        <span className={`${styles.frameLabel} ${frame.active ? styles.frameLabelActive : styles.frameLabelInactive}`}>
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
