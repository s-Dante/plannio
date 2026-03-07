import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1",
    formContainer: "flex flex-col gap-4 w-full max-w-[360px] mx-auto",
    inputGrid: "grid grid-cols-2 gap-3",
    input: "h-11 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-5 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    select: "flex w-full h-11 rounded-full border-0 bg-[#d9dfe5]/70 shadow-inner px-5 text-sm text-[var(--color-sisth)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]",
    submitButton: "mt-4 h-11 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all",
    linkText: "text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2",
    errorText: "mt-1 px-4 text-xs"
};

export default function Register() {
    return (
        <AuthLayout title="Crear una cuenta" imageSrc="/imgs/auth/Img_2.avif">
            <Head title="Registro" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>Crea tu cuenta</h2>
                <p className={styles.subtitle}>Únete para vivir la mejor experiencia en Monterrey</p>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className={styles.formContainer}
            >
                {({ processing, errors }) => (
                    <>
                        <div className={styles.inputGrid}>
                            <div>
                                <Input id="name" type="text" required autoFocus tabIndex={1} name="name" placeholder="Nombre(s)"
                                    className={styles.input} />
                                <InputError message={errors.name} className={styles.errorText} />
                            </div>
                            <div>
                                <Input id="apellido_paterno" type="text" required tabIndex={2} name="apellido_paterno" placeholder="Ap. Paterno"
                                    className={styles.input} />
                            </div>
                        </div>

                        <div className={styles.inputGrid}>
                            <div>
                                <Input id="apellido_materno" type="text" required tabIndex={3} name="apellido_materno" placeholder="Ap. Materno"
                                    className={styles.input} />
                            </div>
                            <div>
                                <Input id="username" type="text" required tabIndex={4} name="username" placeholder="Username"
                                    className={styles.input} />
                            </div>
                        </div>

                        <div>
                            <Input id="email" type="email" required tabIndex={5} autoComplete="email" name="email" placeholder="Correo electrónico"
                                className={styles.input} />
                            <InputError message={errors.email} className={styles.errorText} />
                        </div>

                        <div className={styles.inputGrid}>
                            <div>
                                <Input id="birth_date" type="date" max={new Date().toISOString().split("T")[0]} required tabIndex={6} name="birth_date" placeholder="dd/mm/aaaa"
                                    className={styles.input} />
                            </div>
                            <div>
                                <select id="country" name="country" required tabIndex={7}
                                    className={styles.select}
                                    defaultValue=""
                                >
                                    <option value="" disabled className="text-gray-400">País de origen</option>
                                    <option value="MX">Mexico</option>
                                    <option value="US">Estados Unidos</option>
                                    <option value="ES">España</option>
                                    <option value="OTROC">Otro (Pendiente cargar JSON)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Input id="password" type="password" required tabIndex={8} autoComplete="new-password" name="password" placeholder="Contraseña"
                                className={styles.input} />
                            <InputError message={errors.password} className={styles.errorText} />
                        </div>

                        <div>
                            <Input id="password_confirmation" type="password" required tabIndex={9} autoComplete="new-password" name="password_confirmation" placeholder="Confirmar contraseña"
                                className={styles.input} />
                            <InputError message={errors.password_confirmation} className={styles.errorText} />
                        </div>

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            tabIndex={10}
                            disabled={processing}
                            data-test="register-user-button"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Registrarse
                        </Button>

                        <div className="text-center mt-4">
                            <Link
                                href={login()}
                                tabIndex={11}
                                className={styles.linkText}
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
