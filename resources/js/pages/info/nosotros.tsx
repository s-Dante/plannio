import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Users, Globe2, HeartHandshake } from 'lucide-react';

const styles = {
    // Layout
    page: "min-h-screen w-full bg-[#fdfdfd] text-[#161f27] font-sans overflow-x-hidden selection:bg-[#829965] selection:text-white pb-20",
    header: "w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-20 shrink-0",
    backLink: "inline-flex items-center text-[#161f27] hover:text-[#829965] font-bold transition-colors",
    backIcon: "w-5 h-5 mr-2",
    main: "w-full max-w-4xl mx-auto px-6 mt-10",

    // Hero Section
    heroContainer: "text-center mb-16",
    heroIconWrapper: "inline-flex items-center justify-center p-4 bg-[#829965]/10 text-[#829965] rounded-full mb-6",
    heroIcon: "w-10 h-10",
    heroTitle: "text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6",
    heroHighlight: "text-transparent bg-clip-text bg-gradient-to-r from-[#829965] to-emerald-600",
    heroSubtitle: "text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed",

    // Content Blocks Container
    contentBlocks: "space-y-12",

    // Mission Block (Light)
    missionBlock: "flex flex-col md:flex-row gap-8 items-center bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm",
    missionIconWrapper: "w-20 h-20 shrink-0 bg-[#829965]/10 rounded-2xl flex items-center justify-center",
    missionIcon: "w-10 h-10 text-[#829965]",
    missionTitle: "text-2xl font-bold mb-3",
    missionText: "text-gray-600 leading-relaxed text-lg",

    // Vision Block (Dark)
    visionBlock: "flex flex-col md:flex-row-reverse gap-8 items-center bg-[#161f27] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden",
    visionDeco: "absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none",
    visionIconWrapper: "w-20 h-20 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-sm",
    visionIcon: "w-10 h-10 text-white",
    visionContent: "relative z-10",
    visionTitle: "text-2xl font-bold mb-3",
    visionText: "text-gray-300 leading-relaxed text-lg"
};

export default function Nosotros() {
    return (
        <>
            <Head title="Sobre Nosotros - Plannio" />
            <div className={styles.page}>
                {/* Minimal Header for inner pages */}
                <header className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft className={styles.backIcon} />
                        Volver al inicio
                    </Link>
                </header>

                <main className={styles.main}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroIconWrapper}>
                            <Globe2 className={styles.heroIcon} />
                        </div>
                        <h1 className={styles.heroTitle}>
                            Conectando fans, <br />
                            <span className={styles.heroHighlight}>Creando experiencias</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Plannio nace con un propósito claro: hacer que tu visita a Nuevo León durante el Mundial sea mucho más que ir a un partido.
                        </p>
                    </div>

                    <div className={styles.contentBlocks}>
                        {/* Mission */}
                        <div className={styles.missionBlock}>
                            <div className={styles.missionIconWrapper}>
                                <Users className={styles.missionIcon} />
                            </div>
                            <div>
                                <h2 className={styles.missionTitle}>Nuestra Misión</h2>
                                <p className={styles.missionText}>
                                    Queremos conectar a los turistas y locales de manera significativa. Plannio es la plataforma que te permite organizar grupos, descubrir rincones ocultos de la ciudad guiado por quienes mejor la conocen, y asegurar que tu experiencia mundialista en Monterrey sea segura, organizada e inolvidable.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className={styles.visionBlock}>
                            <div className={styles.visionDeco}></div>
                            <div className={styles.visionIconWrapper}>
                                <HeartHandshake className={styles.visionIcon} />
                            </div>
                            <div className={styles.visionContent}>
                                <h2 className={styles.visionTitle}>¿Por qué usar Plannio?</h2>
                                <p className={styles.visionText}>
                                    Sabemos que viajar a un evento masivo puede ser caótico. Con Plannio, superamos las barreras del idioma y la logística. Encuentra a personas con tus mismos intereses, comparte transporte, organiza salidas a restaurantes y vive el fútbol como nunca antes, en comunidad.
                                </p>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}
