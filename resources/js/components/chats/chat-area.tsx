import { Phone, Video, Lock, Paperclip, Smile, Mic, Users, MapPin, SendHorizonal } from 'lucide-react';

const styles = {
    areaBase: "flex-1 flex flex-col h-full bg-[#f6f7f9] dark:bg-stone-900 border-r border-gray-200 dark:border-stone-800 relative z-0",
    bgPattern: "absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]",

    headerContainer: "h-16 border-b border-gray-200 dark:border-stone-800 flex items-center justify-between px-6 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-10",
    headerLeftMenu: "flex items-center gap-3",
    headerAvatarGroup: "h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center",
    headerAvatarIcon: "h-5 w-5",
    headerTitle: "font-bold text-gray-800 dark:text-gray-100 leading-tight",
    headerRightMenu: "flex items-center gap-5 text-[var(--color-sisth)]/60 dark:text-gray-400",
    headerActionBtn: "hover:text-[var(--color-accent)] transition-colors cursor-pointer",
    headerIcon: "h-5 w-5",

    messagesContainer: "flex-1 overflow-y-auto p-6 space-y-6 flex flex-col relative z-0",

    bubbleRowStart: "flex justify-start flex-col items-start gap-1",
    bubbleRowEnd: "flex justify-end flex-col items-end gap-1",

    bubbleReceived: "relative bg-white dark:bg-stone-800 text-gray-800 dark:text-gray-200 p-3 px-4 rounded-3xl rounded-bl-sm max-w-[70%] shadow-sm border border-gray-100 dark:border-stone-700",
    bubbleSent: "relative bg-[var(--color-accent)] text-[var(--color-sisth)] p-3 px-4 rounded-3xl rounded-br-sm max-w-[70%] shadow-sm",
    bubbleText: "text-sm leading-relaxed font-medium",

    tailReceived: "absolute -bottom-0.5 -left-1.5 w-3 h-3 text-white dark:text-stone-800",
    tailSent: "absolute -bottom-0.5 -right-1.5 w-3 h-3 text-[var(--color-accent)]",

    usernameReceived: "text-[10px] font-bold text-gray-400 pl-1",
    usernameSent: "text-[10px] font-bold text-gray-400 pr-1",

    inputWrapper: "absolute bottom-6 left-6 right-6 z-10 flex items-end gap-2",
    inputBox: "flex-1 flex items-center bg-white dark:bg-stone-800 px-2 py-1 rounded-3xl shadow-md border border-gray-200 dark:border-stone-700 min-h-[50px]",
    inputActionBtn: "p-2 text-gray-500 hover:text-[var(--color-accent)] transition-colors rounded-full cursor-pointer",
    inputIcon: "h-5 w-5",
    inputIconSmile: "h-6 w-6",
    textarea: "flex-1 max-h-32 bg-transparent border-none focus:ring-0 focus:outline-none text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none py-3 px-2 overflow-y-auto",
    sendBtn: "bg-[var(--color-accent)] hover:bg-[#829965] text-white p-3.5 rounded-full shadow-md transition-transform active:scale-95 flex-shrink-0 flex items-center justify-center h-[50px] w-[50px] cursor-pointer",
    sendIcon: "h-6 w-6",
};

export function ChatArea() {
    return (
        <div className={styles.areaBase}>
            <div className={styles.bgPattern}></div>

            <div className={styles.headerContainer}>
                <div className={styles.headerLeftMenu}>
                    <div className={styles.headerAvatarGroup}>
                        <Users className={styles.headerAvatarIcon} />
                    </div>
                    <div>
                        <h3 className={styles.headerTitle}>Grupo 1</h3>
                    </div>
                </div>
                <div className={styles.headerRightMenu}>
                    <button className={styles.headerActionBtn}><Phone className={styles.headerIcon} /></button>
                    <button className={styles.headerActionBtn}><Video className={styles.headerIcon} /></button>
                    <button className={styles.headerActionBtn}><Lock className={styles.headerIcon} /></button>
                </div>
            </div>

            <div className={styles.messagesContainer}>

                <div className="flex-1"></div>

                <div className={styles.bubbleRowStart}>
                    <div className={styles.bubbleReceived}>
                        <svg className={styles.tailReceived} viewBox="0 0 8 13" fill="currentColor">
                            <path d="M8 13H0L8 0V13Z" />
                        </svg>
                        <p className={styles.bubbleText}>Hola, me gusta mucho esta pagina web, ojala que les vaya bien!!!</p>
                    </div>
                    <span className={styles.usernameReceived}>@Persona 1</span>
                </div>

                <div className={styles.bubbleRowEnd}>
                    <div className={styles.bubbleSent}>
                        <svg className={styles.tailSent} viewBox="0 0 8 13" fill="currentColor">
                            <path d="M0 13H8L0 0V13Z" />
                        </svg>
                        <p className={styles.bubbleText}>No manches si quedo bien, no se que mas decir</p>
                    </div>
                </div>

                <div className={styles.bubbleRowEnd}>
                    <div className={styles.bubbleSent}>
                        <svg className={styles.tailSent} viewBox="0 0 8 13" fill="currentColor">
                            <path d="M0 13H8L0 0V13Z" />
                        </svg>
                        <p className={styles.bubbleText}>Pues un lorem ipsum no queda de otra</p>
                    </div>
                </div>

                <div className={styles.bubbleRowStart}>
                    <div className={styles.bubbleReceived}>
                        <svg className={styles.tailReceived} viewBox="0 0 8 13" fill="currentColor">
                            <path d="M8 13H0L8 0V13Z" />
                        </svg>
                        <p className={styles.bubbleText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ex augue, aliquet ut sem non, ultrices mollis magna.</p>
                    </div>
                    <span className={styles.usernameReceived}>@Persona 2</span>
                </div>

                <div className="h-10"></div>

            </div>

            <div className={styles.inputWrapper}>
                <div className={styles.inputBox}>
                    <button className={styles.inputActionBtn}>
                        <Smile className={styles.inputIconSmile} />
                    </button>
                    <button className={styles.inputActionBtn}>
                        <Paperclip className={styles.inputIcon} />
                    </button>
                    <button className={styles.inputActionBtn}>
                        <MapPin className={styles.inputIcon} />
                    </button>

                    <textarea
                        placeholder="Escribe un mensaje"
                        className={styles.textarea}
                        rows={1}
                        style={{ minHeight: '44px' }}
                    />
                </div>

                <button className={styles.sendBtn}>
                    <SendHorizonal className={styles.sendIcon} />
                </button>
            </div>

        </div>
    );
}
