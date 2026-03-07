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

const styles = {
    socialContainer: "flex justify-center gap-4 mb-10",
    socialButton: "w-16 h-10 rounded-full bg-[#dce1dc]/60 hover:bg-[#dce1dc] transition-colors flex items-center justify-center shadow-inner group",
    socialIcon: "w-5 h-5 object-contain group-hover:scale-110 transition-transform",
    formContainer: "flex flex-col gap-5 w-full max-w-[320px] mx-auto",
    inputGrid: "grid gap-4",
    input: "h-12 rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    linkText: "text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2",
    submitButton: "h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all mt-4",
    statusText: "mt-4 text-center text-sm font-medium text-green-600"
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout title="Log in to your account" imageSrc="/imgs/auth/Img_5.jpg">
            <Head title="Log in" />

            <div className={styles.socialContainer}>
                <button type="button" className={styles.socialButton}>
                    <img src="/imgs/svgs/Google.svg" alt="Google Login" className={styles.socialIcon} />
                </button>
                <button type="button" className={styles.socialButton}>
                    <img src="/imgs/svgs/Facebook.svg" alt="Facebook Login" className={styles.socialIcon} />
                </button>
                <button type="button" className={styles.socialButton}>
                    <img src="/imgs/svgs/Github.svg" alt="Github Login" className={styles.socialIcon} />
                </button>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className={styles.formContainer}
            >
                {({ processing, errors }) => (
                    <>
                        <div className={styles.inputGrid}>

                            <div>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="Correo o username"
                                    className={styles.input}
                                />
                                <InputError message={errors.email} className="mt-1 px-4 text-xs" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    className={styles.input}
                                />
                                <InputError message={errors.password} className="px-4 text-xs" />

                                {canResetPassword && (
                                    <Link
                                        href={request()}
                                        className={`${styles.linkText} px-4 mt-1`}
                                        tabIndex={4}
                                    >
                                        ¿Has olvidado tu contraseña?
                                    </Link>
                                )}
                            </div>

                            <input type="hidden" name="remember" value="on" />

                            <div>
                                <Button
                                    type="submit"
                                    className={styles.submitButton}
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
                                    className={styles.linkText}
                                >
                                    ¿No tienes cuenta? Registrate
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className={styles.statusText}>
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
