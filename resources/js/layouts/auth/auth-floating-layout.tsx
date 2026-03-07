import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthFloatingLayout({
    children,
    title,
}: AuthLayoutProps) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[var(--color-primary)] p-4 font-sans selection:bg-[var(--color-accent)] selection:text-white">
            {/* The main floating card container matching AppFloatingLayout */}
            <div className="flex w-full h-full max-h-[850px] max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-[#f0f1f3] shadow-[0px_10px_40px_rgba(0,0,0,0.1)] ring-1 ring-gray-950/5 relative">

                {/* Left Side: Image Map/Maze */}
                <div className="hidden lg:flex w-5/12 p-3">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                        <img
                            src="/imgs/auth/auth1.JPG"
                            alt="Auth Cover"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80'; }}
                        />
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 overflow-y-auto">
                    <div className="w-full max-w-sm flex flex-col items-center">

                        {/* Custom Plannio Logo */}
                        <div className="mb-12">
                            <Link href={home()}>
                                <img
                                    src="/imgs/logos/Plannio_Black_new.PNG"
                                    alt="Plannio"
                                    className="h-14 object-contain scale-[1.8] origin-center"
                                />
                            </Link>
                        </div>

                        {/* Injected Form children */}
                        <div className="w-full">
                            {children}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
