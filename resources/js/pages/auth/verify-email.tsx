import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1",
    statusBox: "mb-6 text-center text-sm font-medium text-[var(--color-accent)] bg-[var(--color-accent)]/10 p-4 rounded-2xl",
    formContainer: "w-full max-w-[320px] mx-auto text-center space-y-6",
    submitButton: "h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all",
    linkText: "text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2 mx-auto inline-block"
};

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout title="Verificar correo electrónico" imageSrc="/imgs/auth/Img_6.jpg">
            <Head title="Verificar correo" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>Verifica tu correo electrónico</h2>
                <p className={styles.subtitle}>Por favor verifica tu dirección haciendo clic en el enlace que acabamos de enviarte.</p>
            </div>

            {status === 'verification-link-sent' && (
                <div className={styles.statusBox}>
                    Se ha enviado un nuevo enlace de verificación a la dirección de correo que proporcionaste en el registro.
                </div>
            )}

            <Form {...send.form()} className={styles.formContainer}>
                {({ processing }) => (
                    <>
                        <Button
                            type="submit"
                            className={styles.submitButton}
                            disabled={processing}
                        >
                            {processing && <Spinner className="mr-2" />}
                            Reenviar correo de verificación
                        </Button>

                        <Link
                            href={logout()}
                            className={styles.linkText}
                        >
                            Cerrar sesión
                        </Link>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
