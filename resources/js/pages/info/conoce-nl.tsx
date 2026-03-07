import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, MapPin, Sprout, Mountain } from 'lucide-react';

const styles = {
    page: "min-h-screen w-full bg-[#fdfdfd] text-[#161f27] font-sans overflow-x-hidden selection:bg-[#E07A5F] selection:text-white pb-20",
    header: "w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-20 shrink-0",
    backLink: "inline-flex items-center text-[#161f27] hover:text-[#E07A5F] font-bold transition-colors",
    backIcon: "w-5 h-5 mr-2",
    main: "w-full max-w-4xl mx-auto px-6 mt-10",

    heroContainer: "text-center mb-16",
    heroIconWrapper: "inline-flex items-center justify-center p-4 bg-[#E07A5F]/10 text-[#E07A5F] rounded-full mb-6",
    heroIcon: "w-10 h-10",
    heroTitle: "text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6",
    heroHighlight: "text-transparent bg-clip-text bg-orange-400",
    heroSubtitle: "text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed",

    grid: "grid md:grid-cols-2 gap-8",

    card: "bg-white p-8 rounded-3xl border-2 border-gray-100 shadow-sm hover:border-[#E07A5F]/30 transition-colors",
    cardIconWrapper: "w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6",
    cardIcon: "w-6 h-6 text-gray-700",
    cardTitle: "text-2xl font-bold mb-4",
    cardText: "text-gray-600 leading-relaxed",

    ctaContainer: "mt-16 text-center",
    ctaBox: "inline-block p-8 bg-[#161f27] text-white rounded-[2.5rem] shadow-xl w-full relative overflow-hidden",
    ctaContent: "relative z-10",
    ctaTitle: "text-2xl font-bold mb-4",
    ctaSubtitle: "mb-6 text-gray-300",
    ctaButton: "inline-flex h-12 items-center justify-center rounded-full bg-white px-8 font-bold text-[#161f27] hover:bg-gray-100 transition-all",
};

export default function ConoceNL() {
    return (
        <>
            <Head title="Conoce Nuevo León" />
            <div className={styles.page}>
                <header className={styles.header}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft className={styles.backIcon} />
                        Volver al inicio
                    </Link>
                </header>

                <main className={styles.main}>
                    <div className={styles.heroContainer}>
                        <div className={styles.heroIconWrapper}>
                            <Mountain className={styles.heroIcon} />
                        </div>
                        <h1 className={styles.heroTitle}>
                            Descubre la ciudad de <br></br><span className={styles.heroHighlight}>Nuevo León</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Más allá del mundial, Nuevo León ofrece una mezcla única de naturaleza, gastronomía y una cultura de gente trabajadora y hospitalaria.
                        </p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardIconWrapper}>
                                <Sprout className={styles.cardIcon} />
                            </div>
                            <h2 className={styles.cardTitle}>Naturaleza Extraordinaria</h2>
                            <p className={styles.cardText}>
                                Explora las montañas icónicas como el Cerro de la Silla, aventúrate en la Huasteca, adentrate en las Grutas de García, o refréscate en las cascadas de Cola de Caballo.
                            </p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardIconWrapper}>
                                <MapPin className={styles.cardIcon} />
                            </div>
                            <h2 className={styles.cardTitle}>Ciudad Única</h2>
                            <p className={styles.cardText}>
                                Monterrey no solo es la capital industrial de México. Disfruta de museos contemporáneos, el Paseo Santa Lucía, Barrio Antiguo asi como de una gastronomía única y un estilo músical nacido de la polka.
                            </p>
                        </div>
                    </div>

                    <div className={styles.ctaContainer}>
                        <div className={styles.ctaBox}>
                            <div className={styles.ctaContent}>
                                <h3 className={styles.ctaTitle}>¿Listo para vivirlo?</h3>
                                <p className={styles.ctaSubtitle}>Únete a Plannio y comienza a trazar tu ruta ideal para el Mundial 2026 en Monterrey.</p>
                                <Link href="/login" className={styles.ctaButton}>
                                    Crear mi cuenta
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
