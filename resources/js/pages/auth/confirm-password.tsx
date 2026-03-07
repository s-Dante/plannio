import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1",
    formContainer: "w-full max-w-[320px] mx-auto",
    inputStack: "flex flex-col gap-4",
    input: "h-12 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    errorText: "mt-1 px-4 text-xs",
    submitButton: "mt-2 h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all"
};

export default function ConfirmPassword() {
    return (
        <AuthLayout title="Confirmar contraseña" imageSrc="/imgs/auth/Img_5.jpg">
            <Head title="Confirmar contraseña" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>Confirma tu contraseña</h2>
                <p className={styles.subtitle}>Esta es un área segura. Por favor confirma tu contraseña antes de continuar.</p>
            </div>

            <Form {...store.form()} resetOnSuccess={['password']} className={styles.formContainer}>
                {({ processing, errors }) => (
                    <div className={styles.inputStack}>
                        <div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                autoFocus
                                className={styles.input}
                            />
                            <InputError message={errors.password} className={styles.errorText} />
                        </div>

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Confirmar contraseña
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
