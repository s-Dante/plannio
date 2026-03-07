import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/two-factor/login';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1 max-w-sm mx-auto",
    formContainer: "w-full max-w-[320px] mx-auto flex flex-col gap-6",
    input: "h-12 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-6 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)] text-center tracking-widest font-mono",
    errorText: "mt-1 px-4 text-xs text-center",
    submitButton: "h-12 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all",
    toggleTextContainer: "text-center text-xs text-[var(--color-sisth)]/80 mt-2",
    toggleLink: "font-bold hover:text-[var(--color-sisth)] underline underline-offset-2 ml-1 cursor-pointer transition-colors"
};

export default function TwoFactorChallenge() {
    const [showRecoveryInput, setShowRecoveryInput] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');

    const authConfigContent = useMemo<{
        title: string;
        description: string;
        toggleText: string;
    }>(() => {
        if (showRecoveryInput) {
            return {
                title: 'Código de recuperación',
                description: 'Por favor confirma el acceso a tu cuenta ingresando uno de tus códigos de recuperación de emergencia.',
                toggleText: 'usar un código de la app de autenticación',
            };
        }

        return {
            title: 'Código de autenticación',
            description: 'Ingresa el código de 6 dígitos proporcionado por tu aplicación de autenticación (Ej. Authy, Google Authenticator).',
            toggleText: 'usar un código de recuperación',
        };
    }, [showRecoveryInput]);

    const toggleRecoveryMode = (clearErrors: () => void): void => {
        setShowRecoveryInput(!showRecoveryInput);
        clearErrors();
        setCode('');
    };

    return (
        <AuthLayout title={authConfigContent.title} imageSrc="/imgs/auth/Img_7.jpg">
            <Head title="Autenticación de dos pasos" />

            <div className={styles.headerContainer}>
                <h2 className={styles.title}>{authConfigContent.title}</h2>
                <p className={styles.subtitle}>{authConfigContent.description}</p>
            </div>

            <Form
                {...store.form()}
                className={styles.formContainer}
                resetOnError
                resetOnSuccess={!showRecoveryInput}
            >
                {({ errors, processing, clearErrors }) => (
                    <>
                        {showRecoveryInput ? (
                            <div>
                                <Input
                                    name="recovery_code"
                                    type="text"
                                    placeholder="Ej. w8d3-3f9k"
                                    autoFocus={showRecoveryInput}
                                    required
                                    className={`${styles.input} text-center font-mono tracking-widest`}
                                />
                                <InputError message={errors.recovery_code} className={styles.errorText} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                <div className="flex w-full items-center justify-center">
                                    <InputOTP
                                        name="code"
                                        maxLength={OTP_MAX_LENGTH}
                                        value={code}
                                        onChange={(value) => setCode(value)}
                                        disabled={processing}
                                        pattern={REGEXP_ONLY_DIGITS}
                                        containerClassName="gap-2"
                                    >
                                        <InputOTPGroup className="gap-2">
                                            {Array.from(
                                                { length: OTP_MAX_LENGTH },
                                                (_, index) => (
                                                    <InputOTPSlot
                                                        key={index}
                                                        index={index}
                                                        className="h-12 w-10 md:w-12 rounded-lg border-x border border-[#d9dfe5]/70 bg-[#d9dfe5]/40 text-lg font-bold shadow-inner focus:ring-1 focus:ring-[var(--color-accent)]"
                                                    />
                                                ),
                                            )}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <InputError message={errors.code} className={styles.errorText} />
                            </div>
                        )}

                        <Button
                            type="submit"
                            className={styles.submitButton}
                            disabled={processing}
                        >
                            Continuar
                        </Button>

                        <div className={styles.toggleTextContainer}>
                            Opcionalmente puedes
                            <button
                                type="button"
                                className={styles.toggleLink}
                                onClick={() => toggleRecoveryMode(clearErrors)}
                            >
                                {authConfigContent.toggleText}
                            </button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
