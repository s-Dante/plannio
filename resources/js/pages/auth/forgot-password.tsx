import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Recuperar contraseña" imageSrc="/imgs/auth/Img_3.jpg">
            <Head title="Recuperar contraseña" />

            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-[var(--color-sisth)]">¿Olvidaste tu contraseña?</h2>
                <p className="text-sm text-[var(--color-sisth)]/60 mt-1 max-w-xs mx-auto">Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</p>
            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 p-3 rounded-2xl">
                    {status}
                </div>
            )}

            <div className="w-full max-w-[320px] mx-auto">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="flex flex-col gap-5">
                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Correo electrónico"
                                    className="h-12 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]"
                                />
                                <InputError message={errors.email} className="mt-1 px-4 text-xs" />
                            </div>

                            <Button
                                className="h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all mt-2"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Enviar enlace de acceso
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="text-center mt-6">
                    <Link
                        href={login()}
                        className="text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2"
                    >
                        Volver a iniciar sesión
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
