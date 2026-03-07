import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout title="Log in to your account" imageSrc="/imgs/auth/Img_5.jpg">
            <Head title="Log in" />

            {/* Social Logins */}
            <div className="flex justify-center gap-4 mb-10">
                <button type="button" className="w-16 h-10 rounded-full bg-[#dce1dc]/60 hover:bg-[#dce1dc] transition-colors flex items-center justify-center shadow-inner">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                </button>
                <button type="button" className="w-16 h-10 rounded-full bg-[#dce1dc]/60 hover:bg-[#dce1dc] transition-colors flex items-center justify-center shadow-inner">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[var(--color-sisth)]" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.365 1.43c0 2.081-1.636 3.794-3.568 3.794-2.031 0-3.535-1.782-3.535-3.869C9.262-.72 10.966-.026 12.83-.026c2.094 0 3.535 1.634 3.535 1.456zm-5.462 4.416c-1.802 0-3.58 1.166-4.498 1.166-1.026 0-2.312-1.127-3.793-1.127-2.396 0-4.634 1.438-5.895 3.654-2.583 4.542-.65 11.267 1.838 14.931 1.206 1.77 2.65 3.766 4.516 3.69 1.802-.075 2.496-1.168 4.697-1.168 2.185 0 2.822 1.168 4.73 1.128 1.956-.037 3.208-1.807 4.391-3.578 1.365-2.03 1.928-3.993 1.965-4.09-.04-.015-3.804-1.464-3.842-5.856-.033-3.665 2.996-5.424 3.125-5.503-1.733-2.536-4.417-2.88-5.368-2.935-2.307-.152-4.54 1.442-5.866 1.442z" />
                    </svg>
                </button>
                <button type="button" className="w-16 h-10 rounded-full bg-[#dce1dc]/60 hover:bg-[#dce1dc] transition-colors flex items-center justify-center shadow-inner">
                </button>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5 w-full max-w-[320px] mx-auto"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">

                            {/* Correo o username Input */}
                            <div>
                                <Input
                                    id="email"
                                    type="text" // User requested Correo o username
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Correo o username"
                                    className="h-12 rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]"
                                />
                                <InputError message={errors.email} className="mt-1 px-4" />
                            </div>

                            {/* Password & Forgot */}
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    className="h-12 rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]"
                                />
                                <InputError message={errors.password} className="px-4" />

                                {canResetPassword && (
                                    <Link
                                        href={request()}
                                        className="text-xs font-bold underline underline-offset-2 text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] px-4 mt-1"
                                        tabIndex={4}
                                    >
                                        ¿Has olvidado tu contraseña?
                                    </Link>
                                )}
                            </div>

                            {/* Hidden remember me, normally we might want it but mockup doesn't show it */}
                            <input type="hidden" name="remember" value="on" />

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all"
                                    tabIndex={3}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Entrar
                                </Button>
                            </div>
                        </div>

                        {canRegister && (
                            <div className="text-center mt-6">
                                <Link
                                    href={register()}
                                    tabIndex={5}
                                    className="text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2"
                                >
                                    ¿No tienes cuenta? Registrate
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
