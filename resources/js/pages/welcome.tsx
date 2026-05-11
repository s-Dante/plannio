import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Map, Users, Leaf, ArrowRight, MapPin, MessageCircle, Calendar, Menu, X } from 'lucide-react';

export default function Welcome({ auth }: { auth?: { user: any } }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="" />
            <div className="min-h-screen w-full bg-[var(--color-primary)] text-[var(--color-sisth)] font-sans overflow-x-hidden flex flex-col selection:bg-[var(--color-accent)] selection:text-white">

                {/* ── Header ── */}
                <header className="w-full max-w-7xl mx-auto px-5 py-5 flex justify-between items-center z-20 shrink-0 relative">

                    {/* Logo: pin en mobile, plannio en desktop */}
                    <div className="flex items-center">
                        <img
                            src="/imgs/logos/Pin_Black_new.PNG"
                            alt="Plannio"
                            className="h-10 w-10 object-contain md:hidden"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <img
                            src="/imgs/logos/Plannio_Black_new.PNG"
                            alt="Plannio"
                            className="hidden md:block h-14 w-32 object-contain origin-left scale-[2]"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>

                    {/* Nav desktop */}
                    <nav className="hidden md:flex items-center gap-10 font-bold text-lg tracking-wide">
                        <Link href="/conoce-nl" className="hover:text-[var(--color-accent)] transition-colors">Conoce</Link>
                        <Link href="/nosotros" className="hover:text-[var(--color-accent)] transition-colors">Nosotros</Link>
                    </nav>

                    {/* Botón desktop */}
                    <div className="hidden md:block">
                        <Link
                            href={auth?.user ? "/chats" : "/login"}
                            className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[var(--color-sisth)] px-8 text-sm font-bold text-[var(--color-sisth)] hover:bg-[var(--color-sisth)] hover:text-white transition-all shadow-sm"
                        >
                            Explora ya
                        </Link>
                    </div>

                    {/* Menú en móvil */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl border-2 border-[var(--color-sisth)]/30 hover:border-[var(--color-sisth)] transition-colors"
                        aria-label="Menú"
                    >
                        {mobileMenuOpen
                            ? <X className="h-5 w-5" />
                            : <Menu className="h-5 w-5" />
                        }
                    </button>

                    {/* Menú móvil desplegable */}
                    {mobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 mx-4 mt-2 bg-white/95 backdrop-blur-xl border-2 border-[var(--color-sisth)] rounded-3xl shadow-xl p-4 flex flex-col gap-2 z-50">
                            <Link
                                href="/conoce-nl"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 px-4 rounded-2xl font-bold text-center hover:bg-gray-50 transition-colors"
                            >
                                Conoce
                            </Link>
                            <Link
                                href="/nosotros"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 px-4 rounded-2xl font-bold text-center hover:bg-gray-50 transition-colors"
                            >
                                Nosotros
                            </Link>
                            <Link
                                href={auth?.user ? "/chats" : "/login"}
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full py-3 px-4 rounded-2xl font-bold text-center bg-[var(--color-sisth)] text-white hover:bg-[var(--color-sisth)]/90 transition-colors mt-1"
                            >
                                Explora ya →
                            </Link>
                        </div>
                    )}
                </header>

                <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col items-center pt-12 lg:pt-20 px-5 relative z-10">

                    {/* ── Hero ── */}
                    <div className="text-center w-full max-w-4xl mx-auto mb-8 md:mb-10">
                        <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-bold tracking-tight text-[var(--color-sisth)] leading-[1.15]">
                            Experimenta el{' '}
                            <span className="relative inline-block px-4 py-1 mx-1 mt-2">
                                <div className="absolute inset-0 bg-[var(--color-accent)]/70 rounded-sm"></div>
                                <span className="relative z-10 text-[var(--color-sisth)] drop-shadow-sm font-bold">mundial</span>
                            </span>{' '}
                            <br className="hidden md:block" />
                            de la forma más regia.
                        </h1>
                    </div>

                    {/* Barra de acción */}
                    <div className="mb-12 md:mb-20 w-full flex justify-center">
                        <div className="hidden md:flex items-center gap-4 bg-[var(--color-primary)] border-2 border-[var(--color-sisth)] rounded-full p-2 shadow-[4px_4px_0px_#161f27]">
                            <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[var(--color-sisth)]/80">
                                <MapPin className="w-4 h-4" /> Conoce la ciudad
                            </div>
                            <div className="w-px h-6 bg-[var(--color-sisth)]/20"></div>
                            <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[var(--color-sisth)]/80">
                                <MessageCircle className="w-4 h-4" /> Conecta con fans
                            </div>
                            <div className="w-px h-6 bg-[var(--color-sisth)]/20"></div>
                            <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[var(--color-sisth)]/80">
                                <Calendar className="w-4 h-4" /> Organiza planes
                            </div>
                            <span className="ml-4 inline-flex items-center justify-center gap-2 h-10 px-6 text-[var(--color-sisth)] font-bold uppercase tracking-wider text-sm">
                                plannio <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>

                        <div className="md:hidden w-full max-w-sm flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] border-2 border-[var(--color-sisth)] rounded-2xl px-3 py-2.5 text-xs font-bold shadow-[3px_3px_0px_#161f27]">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" /> Conoce
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] border-2 border-[var(--color-sisth)] rounded-2xl px-3 py-2.5 text-xs font-bold shadow-[3px_3px_0px_#161f27]">
                                    <MessageCircle className="w-3.5 h-3.5 shrink-0" /> Conecta
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--color-primary)] border-2 border-[var(--color-sisth)] rounded-2xl px-3 py-2.5 text-xs font-bold shadow-[3px_3px_0px_#161f27]">
                                    <Calendar className="w-3.5 h-3.5 shrink-0" /> Organiza
                                </div>
                                <div className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-sisth)] rounded-2xl px-3 py-2.5 text-xs font-bold text-white shadow-[3px_3px_0px_#161f27]">
                                    plannio <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Cards ── */}
                    <div className="w-full max-w-[1000px]">

                        <div className="hidden md:flex relative h-[400px] justify-center items-end pb-10">
                            <div className="flex flex-col text-center shadow-[8px_8px_0px_#161f27] border-[3px] border-[var(--color-sisth)] cursor-default transition-transform absolute left-8 bottom-6 w-72 h-[320px] bg-white rounded-[2rem] p-6 transform -rotate-[4deg] z-10 hover:-translate-y-4 hover:-rotate-[2deg] group">
                                <span className="text-[10px] uppercase font-bold text-[var(--color-sisth)]/50 tracking-widest mb-2 block">Solo necesitas Plannio</span>
                                <h3 className="font-bold leading-tight text-[var(--color-sisth)] text-2xl mb-4">Descubre lugares<br />increíbles</h3>
                                <div className="flex-1 w-full flex items-center justify-center relative">
                                    <div className="absolute rounded-full blur-xl transition-colors w-32 h-32 bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20"></div>
                                    <Map className="text-[var(--color-sisth)] w-28 h-28" strokeWidth={1} />
                                </div>
                            </div>

                            <div className="flex flex-col text-center shadow-[12px_12px_0px_#161f27] border-[3px] border-[var(--color-sisth)] cursor-default transition-transform z-20 w-80 h-[360px] bg-white rounded-[2.5rem] p-8 -translate-y-[30px] hover:-translate-y-[40px] group">
                                <span className="text-[10px] uppercase font-bold text-[var(--color-sisth)]/50 tracking-widest mb-2 block">Solo necesitas Plannio</span>
                                <h3 className="font-bold leading-tight text-[var(--color-sisth)] text-[1.75rem] mb-6">Conecta con<br />otros fans</h3>
                                <div className="flex-1 w-full flex items-center justify-center relative">
                                    <div className="absolute rounded-full blur-xl transition-colors w-40 h-40 bg-[#e07a5f]/10 group-hover:bg-[#e07a5f]/20"></div>
                                    <Users className="text-[var(--color-sisth)] w-32 h-32" strokeWidth={1} />
                                </div>
                            </div>

                            <div className="flex flex-col text-center shadow-[8px_8px_0px_#161f27] border-[3px] border-[var(--color-sisth)] cursor-default transition-transform absolute right-8 bottom-4 w-72 h-[320px] bg-[#fdfdfd] rounded-[2rem] p-6 transform rotate-[4deg] z-10 hover:-translate-y-4 hover:rotate-[2deg] group">
                                <span className="text-[10px] uppercase font-bold text-[var(--color-sisth)]/50 tracking-widest mb-2 block">Solo necesitas Plannio</span>
                                <h3 className="font-bold leading-tight text-[var(--color-sisth)] text-2xl mb-4">Vive la experiencia<br />mundialera</h3>
                                <div className="flex-1 w-full flex items-center justify-center relative">
                                    <div className="absolute rounded-full blur-xl transition-colors w-32 h-32 bg-[var(--color-secundary)]/10 group-hover:bg-[var(--color-secundary)]/20"></div>
                                    <Leaf className="text-[var(--color-sisth)] w-28 h-28" strokeWidth={1} />
                                </div>
                            </div>
                        </div>

                        <div className="md:hidden flex flex-col gap-4 pb-10">
                            {[
                                { icon: Map,   title: 'Descubre lugares increíbles',    deco: 'bg-[var(--color-accent)]/10' },
                                { icon: Users, title: 'Conecta con otros fans',         deco: 'bg-[#e07a5f]/10' },
                                { icon: Leaf,  title: 'Vive la experiencia mundialera', deco: 'bg-[var(--color-secundary)]/10' },
                            ].map(({ icon: Icon, title, deco }) => (
                                <div key={title} className="flex items-center gap-5 bg-white border-[3px] border-[var(--color-sisth)] rounded-[1.5rem] p-5 shadow-[5px_5px_0px_#161f27]">
                                    <div className="relative flex items-center justify-center w-16 h-16 shrink-0">
                                        <div className={`absolute rounded-full blur-lg w-12 h-12 ${deco}`}></div>
                                        <Icon className="text-[var(--color-sisth)] w-10 h-10 relative z-10" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <span className="text-[9px] uppercase font-bold text-[var(--color-sisth)]/50 tracking-widest block mb-1">Solo necesitas Plannio</span>
                                        <h3 className="font-bold text-[var(--color-sisth)] text-base leading-snug">{title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}
