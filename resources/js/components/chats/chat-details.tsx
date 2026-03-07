import { Plus, CheckSquare, ArrowRight } from 'lucide-react';

const styles = {
    // Layout
    detailsBase: "w-80 h-full hidden lg:flex flex-col bg-white dark:bg-stone-900 border-l border-gray-200 dark:border-stone-800 overflow-y-auto",

    // Header
    headerContainer: "p-6 pb-4 text-center border-b border-gray-100 dark:border-stone-800",
    headerAvatarGroup: "h-24 w-24 rounded-full border-4 border-[var(--color-accent)]/20 bg-gray-100 dark:bg-stone-800 shadow-sm mx-auto mb-4 overflow-hidden relative group cursor-pointer",
    headerAvatarText: "absolute inset-0 flex items-center justify-center text-[var(--color-accent)] font-bold text-3xl",
    headerTitle: "text-xl font-extrabold text-[#0D304A] dark:text-white",

    // Body
    bodyContainer: "p-5 space-y-6",

    // Tasks Module
    tasksHeader: "flex items-center justify-between mb-3",
    tasksTitleWrapper: "flex items-center gap-2",
    tasksIconWrapper: "h-5 w-5 text-[var(--color-accent)]",
    tasksTitle: "text-sm font-bold text-[#0D304A] dark:text-gray-200",
    tasksAddBtn: "h-7 w-7 rounded-full bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-white flex items-center justify-center text-[var(--color-accent)] transition-colors cursor-pointer",
    tasksAddIcon: "h-4 w-4",
    tasksList: "space-y-2",

    // Task Items
    taskItemBase: "group flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-800/30 hover:shadow-sm transition-all outline outline-1 outline-transparent hover:outline-[var(--color-accent)]/30 cursor-pointer",
    taskItemActive: "border-gray-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:shadow-md hover:outline-[var(--color-accent)]",

    // Checkboxes
    checkboxChecked: "h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center bg-[var(--color-accent)] text-white",
    checkboxUnchecked: "h-5 w-5 rounded-md flex-shrink-0 flex items-center justify-center border-2 border-[var(--color-sisth)]/20 group-hover:border-[var(--color-accent)] transition-colors",
    checkIcon: "h-3 w-3",

    // Task text
    taskTextChecked: "text-sm font-medium text-[var(--color-sisth)]/60 line-through",
    taskTextUnchecked: "text-sm font-bold text-[#0D304A] dark:text-gray-200",

    taskViewAllBtn: "w-full text-center text-xs font-bold text-[var(--color-accent)] hover:underline pt-2 flex items-center justify-center gap-1 cursor-pointer",
    taskViewAllIcon: "h-3 w-3",

    // Multimedia
    mediaSection: "pt-2 border-t border-gray-100 dark:border-stone-800",
    mediaHeader: "flex items-center justify-between mb-3",
    mediaTitle: "text-sm font-bold text-[#0D304A] dark:text-gray-200",
    mediaViewAll: "text-xs text-[var(--color-accent)] font-semibold cursor-pointer",
    mediaGrid: "grid grid-cols-3 gap-2",
    mediaGridItem: "aspect-square bg-gray-100 dark:bg-stone-800 rounded-xl hover:opacity-80 transition-opacity cursor-pointer border border-gray-200/50",
};

export function ChatDetails() {
    return (
        <div className={styles.detailsBase}>

            {/* Header: Group Info */}
            <div className={styles.headerContainer}>
                <div className={styles.headerAvatarGroup}>
                    {/* Placeholder image representation */}
                    <div className={styles.headerAvatarText}>G1</div>
                </div>
                <h3 className={styles.headerTitle}>Grupo 1</h3>
            </div>

            <div className={styles.bodyContainer}>

                {/* Tasks Module */}
                <div className="pt-2">
                    <div className={styles.tasksHeader}>
                        <div className={styles.tasksTitleWrapper}>
                            <CheckSquare className={styles.tasksIconWrapper} />
                            <h4 className={styles.tasksTitle}>Tareas del Grupo</h4>
                        </div>
                        <button className={styles.tasksAddBtn}>
                            <Plus className={styles.tasksAddIcon} />
                        </button>
                    </div>

                    <div className={styles.tasksList}>
                        {/* Completed Task */}
                        <div className={styles.taskItemBase}>
                            <div className={styles.checkboxChecked}>
                                <CheckSquare className={styles.checkIcon} />
                            </div>
                            <p className={styles.taskTextChecked}>Hacer algo</p>
                        </div>

                        {/* Complete Task 2 */}
                        <div className={styles.taskItemBase}>
                            <div className={styles.checkboxChecked}>
                                <CheckSquare className={styles.checkIcon} />
                            </div>
                            <p className={styles.taskTextChecked}>Hacer otra cosa</p>
                        </div>

                        {/* Pending Task */}
                        <div className={`${styles.taskItemBase} ${styles.taskItemActive}`}>
                            <div className={styles.checkboxUnchecked}>
                            </div>
                            <p className={styles.taskTextUnchecked}>Hacer otra cosa</p>
                        </div>

                        <button className={styles.taskViewAllBtn}>
                            Ver todas <ArrowRight className={styles.taskViewAllIcon} />
                        </button>
                    </div>
                </div>

                {/* Media/Shared Content Section */}
                <div className={styles.mediaSection}>
                    <div className={styles.mediaHeader}>
                        <h4 className={styles.mediaTitle}>Multimedia</h4>
                        <span className={styles.mediaViewAll}>Ver todo</span>
                    </div>

                    <div className={styles.mediaGrid}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles.mediaGridItem}></div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
