import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="PLANNIO">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <header className="w-full shadow-sm sticky top-0 z-10 max-w-6xl mx-auto  py-4 flex justify-between">
                <img src="Aqui va el logo" alt="Logotipo de plannio" />
                <Link>
                    <button>
                        
                    </button>
                </Link>
            </header>

            <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
            </main>
        </>
    );
}
