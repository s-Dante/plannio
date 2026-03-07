import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1",
    formContainer: "w-full max-w-[320px] mx-auto",
    inputStack: "flex flex-col gap-4",
    inputReadonly: "h-12 w-full rounded-full border-0 bg-[#d9dfe5]/40 opacity-70 px-6 text-sm text-[var(--color-sisth)] cursor-not-allowed",
    input: "h-12 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    errorText: "mt-1 px-4 text-xs",
    submitButton: "mt-4 h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all"
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <AuthLayout title="Restablecer contraseña" imageSrc="/imgs/auth/Img_4.jpg">
            <Head title="Restablecer contraseña" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>Crea tu nueva contraseña</h2>
                <p className={styles.subtitle}>Por favor ingresa la nueva contraseña de tu cuenta.</p>
            </div>

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className={styles.formContainer}
            >
                {({ processing, errors }) => (
                    <div className={styles.inputStack}>
                        <div>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                                className={styles.inputReadonly}
                            />
                            <InputError message={errors.email} className={styles.errorText} />
                        </div>

                        <div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Nueva Contraseña"
                                className={styles.input}
                            />
                            <InputError message={errors.password} className={styles.errorText} />
                        </div>

                        <div>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirmar Nueva Contraseña"
                                className={styles.input}
                            />
                            <InputError message={errors.password_confirmation} className={styles.errorText} />
                        </div>

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Restablecer contraseña
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
