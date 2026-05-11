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
import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';

const RARITY_META: Record<number, { label: string; gradient: string; ring: string; text: string }> = {
    1: { label: 'Común',       gradient: 'slate-400',     ring: 'ring-slate-300',   text: 'text-slate-600 dark:text-slate-300' },
    2: { label: 'Poco Común',  gradient: 'emerald-400',    ring: 'ring-emerald-300', text: 'text-emerald-600 dark:text-emerald-400' },
    3: { label: 'Raro',        gradient: 'blue-400',     ring: 'ring-blue-300',    text: 'text-blue-600 dark:text-blue-400' },
    4: { label: 'Épico',       gradient: 'purple-500',  ring: 'ring-purple-300',  text: 'text-purple-600 dark:text-purple-400' },
    5: { label: 'Legendario',  gradient: 'amber-400',    ring: 'ring-amber-300',   text: 'text-amber-600 dark:text-amber-400' },
};


const isEmoji = (s: string) => !!s && !s.startsWith('http') && !s.startsWith('#') && !s.startsWith('/');

const styles = {
    dialogContent: "max-w-[90vw] md:max-w-[45vw] overflow-y-auto max-h-[90vh] p-0 border border-gray-200 dark:border-stone-800 rounded-2xl shadow-xl bg-white dark:bg-[#111214]",
    dialogHeader: "p-5 pb-3 border-b border-gray-100 dark:border-stone-800 bg-gray-50/50 dark:bg-[#111214]",
    dialogTitle: "flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100",
    headerIcon: "h-5 w-5 text-zinc-800 dark:text-zinc-200",
    dialogDescription: "text-sm text-gray-500 dark:text-gray-400",
    bodyContainer: "p-6 space-y-8 bg-white dark:bg-[#111214]",

    previewSection: "flex flex-col md:flex-row items-center gap-6 justify-center",
    previewCard: "flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-stone-900/50 border border-gray-200 dark:border-stone-800 w-full shadow-sm",
    avatarWrapper: "relative flex items-center justify-center shrink-0",
    avatar: "h-20 w-20 rounded-full border border-gray-200 dark:border-stone-700 bg-white dark:bg-[#111214] z-0",
    avatarImage: "object-cover",
    avatarFallback: "text-xl rounded-full bg-primary/10 text-primary",
    frameImageOverlay: "absolute z-10 pointer-events-none scale-125 object-contain",
    previewUserDetails: "flex flex-col gap-2 z-10 min-w-0",
    previewUserName: "text-base font-bold text-gray-900 dark:text-gray-100 truncate",
    previewBadgesContainer: "flex flex-wrap gap-1.5",

    gridsContainer: "grid grid-cols-1 md:grid-cols-2 gap-8",
    sectionBase: "space-y-3",
    sectionHeader: "flex items-center gap-2",
    sectionTitle: "text-base font-bold text-gray-900 dark:text-gray-100",

    badgesGrid: "grid grid-cols-2 gap-3",
    badgeCardBase: "relative flex flex-col items-center gap-2 p-4 rounded-2xl cursor-pointer transition-all select-none",
    badgeCardActive: "ring-2 shadow-lg scale-[1.02]",
    badgeCardInactive: "ring-1 ring-gray-200 dark:ring-stone-700 bg-white dark:bg-stone-900 shadow-sm hover:scale-[1.01] hover:shadow-md",
    checkIndicatorSmall: "absolute -top-1.5 -right-1.5 h-5 w-5 bg-indigo-500 text-white rounded-full flex items-center justify-center text-[10px] shadow z-10 font-bold",

    framesGrid: "grid grid-cols-3 gap-3",
    frameCardBase: "relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl cursor-pointer transition-all",
    frameCardActive: "bg-emerald-50 ring-2 ring-emerald-400 dark:bg-emerald-500/10 shadow-md scale-[1.02]",
    frameCardInactive: "bg-white dark:bg-stone-900 ring-1 ring-gray-200 dark:ring-stone-700 shadow-sm hover:scale-[1.01] hover:shadow-md",
    frameCheckIndicator: "absolute -top-1.5 -right-1.5 h-5 w-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] shadow z-10 font-bold",
    framePreviewWrapper: "relative flex items-center justify-center h-14 w-14",
    framePreviewAvatar: "h-10 w-10 rounded-full bg-gray-200 dark:bg-stone-800 flex items-center justify-center z-0",
    framePreviewAvatarText: "text-[10px] text-gray-400 font-medium",
    framePreviewImage: "absolute z-10 pointer-events-none scale-[1.3] object-contain",
    frameLabel: "text-[10px] text-center font-semibold leading-tight",
    frameLabelActive: "text-emerald-700 dark:text-emerald-400",
    frameLabelInactive: "text-gray-500 dark:text-gray-400",
};

interface RewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
    const getInitials = useInitials();
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || 'Usuario';
    const userAvatar = auth?.user?.avatar || '';

    const [rewards, setRewards] = useState<any[]>([]);
    const [unlocked, setUnlocked] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            axios.get('/rewards').then(res => {
                setRewards(res.data.rewards);
                setUnlocked(res.data.unlocked);
            }).finally(() => setLoading(false));
        }
    }, [isOpen]);

    const handleToggleEquip = (rewardId: number) => {
        const isUnlocked = unlocked.some(u => u.pivot.reward_id === rewardId);
        if (!isUnlocked) {
            const reward = rewards.find(r => r.id === rewardId);
            toast.error(`Necesitas ${reward?.points_required} puntos para desbloquear esto.`);
            return;
        }

        axios.post(`/rewards/${rewardId}/equip`).then(() => {
            axios.get('/rewards').then(res => {
                setUnlocked(res.data.unlocked);
                router.reload();
            });
        }).catch(err => {
            toast.error(err.response?.data?.errors?.message?.[0] || 'No se pudo equipar.');
        });
    };

    const isEquipped = (rewardId: number) => {
        return unlocked.some(u => u.pivot.reward_id === rewardId && u.pivot.is_equipped);
    };

    const isUnlocked = (rewardId: number) => {
        return unlocked.some(u => u.pivot.reward_id === rewardId);
    };

    const badges = rewards.filter(r => r.type === 1);
    const frames = rewards.filter(r => r.type === 2);
    const equippedBadges = unlocked.filter(u => u.type === 1 && u.pivot.is_equipped);
    const equippedFrame = unlocked.find(u => u.type === 2 && u.pivot.is_equipped);

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
                                    <AvatarFallback className={styles.avatarFallback}>{getInitials(userName)}</AvatarFallback>
                                </Avatar>
                                {equippedFrame && equippedFrame.image_url && !equippedFrame.image_url.startsWith('#') && (
                                    <img src={equippedFrame.image_url} alt="Active Frame" className={styles.frameImageOverlay} style={{ width: '135%', height: '135%' }} />
                                )}
                                {equippedFrame && equippedFrame.image_url?.startsWith('#') && (
                                    <div className="absolute z-10 w-[135%] h-[135%] rounded-full border-4 pointer-events-none" style={{ borderColor: equippedFrame.image_url }} />
                                )}
                            </div>
                            <div className={styles.previewUserDetails}>
                                <div className={styles.previewUserName}>
                                    {userName}
                                    <span className="text-xs font-semibold text-yellow-500 ml-2">⭐ {auth?.user?.points} pts</span>
                                </div>
                                <div className={styles.previewBadgesContainer}>
                                    {equippedBadges.length === 0 && (
                                        <span className="text-xs text-gray-400 italic">Sin insignias equipadas</span>
                                    )}
                                    {equippedBadges.map(badge => {
                                        const meta = RARITY_META[badge.rarity] ?? RARITY_META[1];
                                        return (
                                            <span
                                                key={badge.id}
                                                title={badge.name}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${meta.gradient} shadow-sm`}
                                            >
                                                {badge.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {loading ? (
                        <div className="flex justify-center p-8 text-gray-400">Cargando recompensas...</div>
                    ) : (
                        <div className={styles.gridsContainer}>
                            <section className={styles.sectionBase}>
                                <div className={styles.sectionHeader}>
                                    <Award className={styles.headerIcon} />
                                    <h2 className={styles.sectionTitle}>Insignias</h2>
                                </div>

                                <div className={styles.badgesGrid}>
                                    {badges.map((badge: any) => {
                                        const active   = isEquipped(badge.id);
                                        const unlocked = isUnlocked(badge.id);
                                        const meta     = RARITY_META[badge.rarity] ?? RARITY_META[1];
                                        return (
                                            <div
                                                key={badge.id}
                                                onClick={() => handleToggleEquip(badge.id)}
                                                className={`${styles.badgeCardBase} ${active ? `${styles.badgeCardActive} ${meta.ring}` : styles.badgeCardInactive} ${!unlocked ? 'opacity-60' : ''}`}
                                            >
                                                {active && <div className={styles.checkIndicatorSmall}>✓</div>}
                                                {!unlocked && (
                                                    <div className="absolute inset-0 rounded-2xl z-20 flex flex-col items-center justify-center backdrop-blur-[2px] bg-white/50 dark:bg-black/50">
                                                        <span className="text-lg">🔒</span>
                                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 mt-0.5">{badge.points_required} pts</span>
                                                    </div>
                                                )}
                                                {/* Bloque de color sólido con nombre */}
                                                <div className={`flex items-center justify-center w-full py-3 px-2 rounded-xl bg-gradient-to-br ${meta.gradient} shadow-md`}>
                                                    <span className="text-xs font-bold text-white text-center leading-tight drop-shadow-sm">{badge.name}</span>
                                                </div>
                                                <p className={`text-[10px] font-semibold ${meta.text} text-center`}>{meta.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className={styles.sectionBase}>
                                <div className={styles.sectionHeader}>
                                    <Frame className={styles.headerIcon} />
                                    <h2 className={styles.sectionTitle}>Marcos</h2>
                                </div>

                                <div className={styles.framesGrid}>
                                    {frames.map((frame: any) => {
                                        const active = isEquipped(frame.id);
                                        const unlocked = isUnlocked(frame.id);
                                        return (
                                            <div
                                                key={frame.id}
                                                onClick={() => handleToggleEquip(frame.id)}
                                                className={`${styles.frameCardBase} ${active ? styles.frameCardActive : styles.frameCardInactive}`}
                                            >
                                                {active && <div className={styles.frameCheckIndicator}>✓</div>}
                                                {!unlocked && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 rounded-lg z-20 flex items-center justify-center backdrop-blur-[1px]"><span className="text-[10px] font-bold">🔒 {frame.points_required}</span></div>}

                                                <div className={styles.framePreviewWrapper}>
                                                    <div className={styles.framePreviewAvatar}>
                                                        <span className={styles.framePreviewAvatarText}>Yo</span>
                                                    </div>

                                                    {frame.image_url && !frame.image_url.startsWith('#') ? (
                                                        <img
                                                            src={frame.image_url}
                                                            alt={frame.name}
                                                            className={`${styles.framePreviewImage} ${!unlocked ? 'opacity-50 grayscale' : ''}`}
                                                            style={{ width: '110%', height: '110%' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`absolute z-10 w-[110%] h-[110%] rounded-full border-4 pointer-events-none ${!unlocked ? 'opacity-50 grayscale' : ''}`}
                                                            style={{ borderColor: frame.image_url }}
                                                        ></div>
                                                    )}
                                                </div>

                                                <span className={`${styles.frameLabel} ${active ? styles.frameLabelActive : styles.frameLabelInactive}`}>
                                                    {frame.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
