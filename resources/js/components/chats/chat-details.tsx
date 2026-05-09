import { Plus, CheckSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CreateTaskModal } from '@/components/create-task-modal';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

const styles = {
    // Mobile: full-width visible (controlado desde Index con translate).
    // Desktop: ancho fijo, siempre visible en lg+.
    detailsBase: "w-full h-full flex flex-col bg-white dark:bg-stone-900 border-l border-gray-200 dark:border-stone-800 overflow-y-auto lg:w-80",

    headerContainer: "p-6 pb-4 text-center border-b border-gray-100 dark:border-stone-800",
    headerAvatarGroup: "h-24 w-24 rounded-full border-4 border-[var(--color-accent)]/20 bg-gray-100 dark:bg-stone-800 shadow-sm mx-auto mb-4 overflow-hidden relative group cursor-pointer",
    headerAvatarText: "absolute inset-0 flex items-center justify-center text-[var(--color-accent)] font-bold text-3xl",
    headerTitle: "text-xl font-extrabold text-[#0D304A] dark:text-white",

    bodyContainer: "p-5 space-y-6",

    tasksHeader: "flex items-center justify-between mb-3",
    tasksTitleWrapper: "flex items-center gap-2",
    tasksIconWrapper: "h-5 w-5 text-[var(--color-accent)]",
    tasksTitle: "text-sm font-bold text-[#0D304A] dark:text-gray-200",
    tasksAddBtn: "h-7 w-7 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-white flex items-center justify-center text-[var(--color-accent)] transition-colors cursor-pointer",
    tasksAddIcon: "h-4 w-4",
    tasksList: "space-y-2",

    taskItemBase: "group flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-800/30 hover:shadow-sm transition-all outline outline-1 outline-transparent hover:outline-[var(--color-accent)]/30 cursor-pointer",
    taskItemActive: "border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:shadow-md hover:outline-[var(--color-accent)]",

    checkboxChecked: "h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center bg-[var(--color-accent)] text-white",
    checkboxUnchecked: "h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 border-[var(--color-sisth)]/20 group-hover:border-[var(--color-accent)] transition-colors",
    checkIcon: "h-3 w-3",

    taskTextChecked: "text-sm font-medium text-[var(--color-sisth)]/60 line-through",
    taskTextUnchecked: "text-sm font-bold text-[#0D304A] dark:text-gray-200",

    taskViewAllBtn: "w-full text-center text-xs font-bold text-[var(--color-accent)] hover:underline pt-2 flex items-center justify-center gap-1 cursor-pointer",
    taskViewAllIcon: "h-3 w-3",

    mediaSection: "pt-2 border-t border-gray-100 dark:border-stone-800",
    mediaHeader: "flex items-center justify-between mb-3",
    mediaTitle: "text-sm font-bold text-[#0D304A] dark:text-gray-200",
    mediaViewAll: "text-xs text-[var(--color-accent)] font-semibold cursor-pointer",
    mediaGrid: "grid grid-cols-3 gap-2",
    mediaGridItem: "aspect-square bg-gray-100 dark:bg-stone-800 rounded-xl hover:opacity-80 transition-opacity cursor-pointer border border-gray-200/50",
};

export function ChatDetails({ activeChat, messages = [], onOpenMedia, auth, onBack }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [optimisticTasks, setOptimisticTasks] = useState<any[]>([]);

    useEffect(() => {
        if (activeChat?.tasks) {
            setOptimisticTasks(activeChat.tasks);
        }
    }, [activeChat]);

    if (!activeChat) return null;

    // Extraer solo imagenes o videos del historial
    const mediaItems = messages.filter((m: any) => m.type === 2 || m.type === 3).reverse(); // Reverse para que las mas nuevas salgan primero

    const toggleTask = (task: any, isCheckedForMe: boolean) => {
        const newStatus = isCheckedForMe ? 1 : 3; // 1 = TODO, 3 = DONE
        
        // Optimistic UI update based on completions instead of just global status
        setOptimisticTasks(prev => prev.map(t => {
            if (t.id === task.id) {
                if (newStatus === 3) {
                    return { ...t, completions: [...(t.completions || []), { user_id: auth?.user?.id }] };
                } else {
                    return { ...t, completions: (t.completions || []).filter((c: any) => c.user_id !== auth?.user?.id), status: 1 };
                }
            }
            return t;
        }));

        router.put(`/tasks/${task.id}/status`, { status: newStatus }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (newStatus === 3) {
                    toast.success('¡Tarea completada! Has ganado puntos.', { icon: '🎉' });
                }
            },
            onError: () => {
                // Revert si falla
                setOptimisticTasks(activeChat.tasks);
                toast.error('Error al actualizar la tarea');
            }
        });
    };

    return (
        <div className={styles.detailsBase}>

            {/* Botón back — solo mobile */}
            {onBack && (
                <div className="lg:hidden px-4 pt-4 pb-0">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[var(--color-accent)] transition-colors py-1"
                    >
                        <ArrowLeft className="h-4 w-4" /> Volver al chat
                    </button>
                </div>
            )}

            <div className={styles.headerContainer}>
                <div className={styles.headerAvatarGroup}>
                    {activeChat.avatar ? 
                        <img src={activeChat.avatar} className="w-full h-full object-cover" /> :
                        <div className={styles.headerAvatarText}>{activeChat.name?.charAt(0)}</div>
                    }
                </div>
                <h3 className={styles.headerTitle}>{activeChat.name}</h3>
            </div>

            <div className={styles.bodyContainer}>

                <div className="pt-2">
                    <div className={styles.tasksHeader}>
                        <div className={styles.tasksTitleWrapper}>
                            <CheckSquare className={styles.tasksIconWrapper} />
                            <h4 className={styles.tasksTitle}>Tareas del Grupo</h4>
                        </div>
                        <button className={styles.tasksAddBtn} onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className={styles.tasksAddIcon} />
                        </button>
                    </div>

                    <div className={styles.tasksList}>
                        {optimisticTasks.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-2">No hay tareas en este grupo</p>
                        ) : (
                            optimisticTasks.slice(0, 5).map((task: any) => {
                                const isCheckedForMe = task.status === 3 || task.completions?.some((c: any) => c.user_id === auth?.user?.id);
                                const totalMembers = activeChat.members?.length || 1;
                                const completedCount = task.completions?.length || 0;
                                const isFullyCompleted = task.status === 3;

                                return (
                                    <div 
                                        key={task.id} 
                                        className={`${styles.taskItemBase} ${!isCheckedForMe ? styles.taskItemActive : ''}`}
                                        onClick={() => toggleTask(task, isCheckedForMe)}
                                    >
                                        <div className={isCheckedForMe ? styles.checkboxChecked : styles.checkboxUnchecked}>
                                            {isCheckedForMe && <CheckSquare className={styles.checkIcon} />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={isCheckedForMe ? styles.taskTextChecked : styles.taskTextUnchecked}>
                                                {task.title}
                                            </p>
                                            {!isFullyCompleted && isCheckedForMe && totalMembers > 1 && (
                                                <p className="text-[10px] text-[var(--color-accent)] font-bold mt-0.5">
                                                    Esperando a otros ({completedCount}/{totalMembers})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {optimisticTasks.length > 5 && (
                            <button className={styles.taskViewAllBtn} onClick={() => router.visit('/tasks')}>
                                Ver todas <ArrowRight className={styles.taskViewAllIcon} />
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.mediaSection}>
                    <div className={styles.mediaHeader}>
                        <h4 className={styles.mediaTitle}>Multimedia</h4>
                        <span className={styles.mediaViewAll}>Ver todo</span>
                    </div>

                    <div className={styles.mediaGrid}>
                        {mediaItems.length === 0 && (
                            <p className="text-xs text-gray-400 col-span-3 text-center py-4">No hay multimedia</p>
                        )}
                        {mediaItems.slice(0, 9).map((media: any) => (
                            <div 
                                key={media.id} 
                                className={styles.mediaGridItem + " overflow-hidden"}
                                onClick={() => onOpenMedia(media)}
                            >
                                {media.type === 2 ? (
                                    <img src={media.media_url} className="w-full h-full object-cover" />
                                ) : (
                                    <video src={media.media_url} className="w-full h-full object-cover"></video>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <CreateTaskModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                groupId={activeChat.id}
            />
        </div>
    );
}
