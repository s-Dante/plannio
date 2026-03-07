import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1 max-w-xs mx-auto",
    statusBox: "mb-4 text-center text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 p-3 rounded-2xl",
    formContainer: "w-full max-w-[320px] mx-auto",
    inputStack: "flex flex-col gap-5",
    input: "h-12 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    errorText: "mt-1 px-4 text-xs",
    submitButton: "h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all mt-2",
    linkText: "text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2"
};

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout title="Recuperar contraseña" imageSrc="/imgs/auth/Img_3.jpg">
            <Head title="Recuperar contraseña" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>¿Olvidaste tu contraseña?</h2>
                <p className={styles.subtitle}>Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</p>
            </div>

            {status && (
                <div className={styles.statusBox}>
                    {status}
                </div>
            )}

            <div className={styles.formContainer}>
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className={styles.inputStack}>
                            <div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Correo electrónico"
                                    className={styles.input}
                                />
                                <InputError message={errors.email} className={styles.errorText} />
                            </div>

                            <Button
                                className={styles.submitButton}
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
                        className={styles.linkText}
                    >
                        Volver a iniciar sesión
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
