import { Head, Link } from '@inertiajs/react';
import { Map, Users, Leaf, ArrowRight, MapPin, MessageCircle, Calendar } from 'lucide-react';

const styles = {
    page: "min-h-screen w-full bg-[var(--color-primary)] text-[var(--color-sisth)] font-sans overflow-x-hidden flex flex-col selection:bg-[var(--color-accent)] selection:text-white",
    header: "w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-20 shrink-0",
    logoImage: "h-14 w-32 object-contain origin-left scale-[2] md:scale-[2]",
    nav: "hidden md:flex items-center gap-10 font-bold text-lg tracking-wide",
    navLink: "hover:text-[var(--color-accent)] transition-colors",
    navButton: "inline-flex h-12 items-center justify-center rounded-full border-2 border-[var(--color-sisth)] px-8 text-sm font-bold text-[var(--color-sisth)] hover:bg-[var(--color-sisth)] hover:text-white transition-all shadow-sm",
    main: "flex-1 w-full max-w-[1200px] mx-auto flex flex-col items-center pt-10 lg:pt-16 px-6 relative z-10",

    heroContainer: "text-center w-full max-w-4xl mx-auto mb-10",
    heroTitle: "text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight text-[var(--color-sisth)] leading-[1.15]",
    heroHighlightWrapper: "relative inline-block px-4 py-1 mx-1 mt-2",
    heroHighlightBox: "absolute inset-0 bg-[var(--color-accent)]/70 rounded-sm",
    heroHighlightText: "relative z-10 text-[var(--color-sisth)] drop-shadow-sm font-bold",

    actionBar: "flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-[var(--color-primary)] border-2 border-[var(--color-sisth)] rounded-full p-2 mb-20 shadow-[4px_4px_0px_#161f27]",
    actionItem: "flex items-center gap-2 px-3 lg:px-4 py-2 text-xs md:text-sm font-bold text-[var(--color-sisth)]/80",
    actionDivider: "hidden sm:block w-px h-6 bg-[var(--color-sisth)]/20",
    actionText: "ml-1 md:ml-4 inline-flex items-center justify-center gap-2 h-10 px-6 text-[var(--color-sisth)] font-bold uppercase tracking-wider text-xs md:text-sm",

    cardsContainer: "relative w-full max-w-[1000px] h-[350px] md:h-[400px] flex justify-center items-end pb-10",
    cardBase: "flex flex-col text-center shadow-[8px_8px_0px_#161f27] border-[3px] border-[var(--color-sisth)] cursor-default transition-transform",
    cardSubtitle: "text-[9px] md:text-[10px] uppercase font-bold text-[var(--color-sisth)]/50 tracking-widest mb-2 block",
    cardTitleBase: "font-bold leading-tight text-[var(--color-sisth)]",
    cardImageWrapper: "flex-1 w-full flex items-center justify-center relative",
    cardDecorationLayer: "absolute rounded-full blur-xl transition-colors",
    cardIcon: "text-[var(--color-sisth)]",

    leftCard: "absolute left-0 md:left-8 bottom-6 w-64 md:w-72 h-[280px] md:h-[320px] bg-white rounded-[2rem] p-6 transform -rotate-[4deg] z-10 hover:-translate-y-4 hover:-rotate-[2deg] group",
    leftCardTitle: "text-xl md:text-2xl mb-4",
    leftCardDecoMain: "w-32 h-32 bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20",

    centerCard: "z-20 w-72 md:w-80 h-[320px] md:h-[360px] bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[12px_12px_0px_#161f27] -translate-y-[20px] md:-translate-y-[30px] hover:-translate-y-[40px] group",
    centerCardTitle: "text-2xl md:text-[1.75rem] mb-6",
    centerCardDecoMain: "w-40 h-40 bg-[#e07a5f]/10 group-hover:bg-[#e07a5f]/20",

    rightCard: "absolute right-0 md:right-8 bottom-4 w-64 md:w-72 h-[280px] md:h-[320px] bg-[#fdfdfd] rounded-[2rem] p-6 transform rotate-[4deg] z-10 hover:-translate-y-4 hover:rotate-[2deg] group",
    rightCardTitle: "text-xl md:text-2xl mb-4",
    rightCardDecoMain: "w-32 h-32 bg-[var(--color-secundary)]/10 group-hover:bg-[var(--color-secundary)]/20",
};

export default function Welcome({ auth }: { auth?: { user: any } }) {
    return (
        <>
            <Head title="Bienvenido a Plannio" />
            <div className={styles.page}>

                <header className={styles.header}>
                    <div className="flex items-center">
                        <img
                            src="/imgs/logos/Plannio_Black_new.PNG"
                            alt="Plannio Logo"
                            className={styles.logoImage}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>

                    <nav className={styles.nav}>
                        <Link href="/conoce-nl" className={styles.navLink}>Conoce</Link>
                        <Link href="/nosotros" className={styles.navLink}>Nosotros</Link>
                    </nav>

                    <div>
                        <Link href={auth?.user ? "/chats" : "/login"} className={styles.navButton}>
                            Explora ya
                        </Link>
                    </div>
                </header>

                <main className={styles.main}>

                    <div className={styles.heroContainer}>
                        <h1 className={styles.heroTitle}>
                            Experimenta el{' '}
                            <span className={styles.heroHighlightWrapper}>
                                <div className={styles.heroHighlightBox}></div>
                                <span className={styles.heroHighlightText}>mundial</span>
                            </span>{' '}
                            <br className="hidden md:block" />
                            de la forma más regia.
                        </h1>
                    </div>

                    <div className={styles.actionBar}>
                        <div className={styles.actionItem}>
                            <MapPin className="w-4 h-4" /> Conoce la ciudad
                        </div>
                        <div className={styles.actionDivider}></div>
                        <div className={styles.actionItem}>
                            <MessageCircle className="w-4 h-4" /> Conecta con fans
                        </div>
                        <div className={styles.actionDivider}></div>
                        <div className={styles.actionItem}>
                            <Calendar className="w-4 h-4" /> Organiza planes
                        </div>

                        <span className={styles.actionText}>
                            plannio <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>

                    <div className={styles.cardsContainer}>

                        <div className={`${styles.cardBase} ${styles.leftCard}`}>
                            <span className={styles.cardSubtitle}>Solo necesitas Plannio</span>
                            <h3 className={`${styles.cardTitleBase} ${styles.leftCardTitle}`}>Descubre lugares<br />increíbles</h3>

                            <div className={styles.cardImageWrapper}>
                                <div className={`${styles.cardDecorationLayer} ${styles.leftCardDecoMain}`}></div>
                                <Map className={`${styles.cardIcon} w-20 md:w-28 h-20 md:h-28`} strokeWidth={1} />
                            </div>
                        </div>

                        <div className={`${styles.cardBase} ${styles.centerCard}`}>
                            <span className={styles.cardSubtitle}>Solo necesitas Plannio</span>
                            <h3 className={`${styles.cardTitleBase} ${styles.centerCardTitle}`}>Conecta con<br />otros fans</h3>

                            <div className={styles.cardImageWrapper}>
                                <div className={`${styles.cardDecorationLayer} ${styles.centerCardDecoMain}`}></div>
                                <Users className={`${styles.cardIcon} w-24 md:w-32 h-24 md:h-32`} strokeWidth={1} />
                            </div>
                        </div>

                        <div className={`${styles.cardBase} ${styles.rightCard}`}>
                            <span className={styles.cardSubtitle}>Solo necesitas Plannio</span>
                            <h3 className={`${styles.cardTitleBase} ${styles.rightCardTitle}`}>Vive la experiencia<br />mundialera</h3>

                            <div className={styles.cardImageWrapper}>
                                <div className={`${styles.cardDecorationLayer} ${styles.rightCardDecoMain}`}></div>
                                <Leaf className={`${styles.cardIcon} w-20 md:w-28 h-20 md:h-28`} strokeWidth={1} />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}
