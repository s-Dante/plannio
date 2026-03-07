import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/user-password';
import type { BreadcrumbItem } from '@/types';

const styles = {
    container: "space-y-6",
    srOnlyTitle: "sr-only",
    formBase: "space-y-6",
    inputGroup: "grid gap-2",
    inputField: "mt-1 block w-full",
    actionsContainer: "flex items-center gap-4",
    successAlertText: "text-sm text-neutral-600"
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de contraseña',
        href: edit(),
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de contraseña" />

            <h1 className={styles.srOnlyTitle}>Configuración de contraseña</h1>

            <SettingsLayout>
                <div className={styles.container}>
                    <Heading
                        variant="small"
                        title="Actualizar contraseña"
                        description="Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerte seguro."
                    />

                    <Form
                        {...PasswordController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
                                passwordInput.current?.focus();
                            }

                            if (errors.current_password) {
                                currentPasswordInput.current?.focus();
                            }
                        }}
                        className={styles.formBase}
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className={styles.inputGroup}>
                                    <Label htmlFor="current_password">
                                        Contraseña actual
                                    </Label>

                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                        className={styles.inputField}
                                        autoComplete="current-password"
                                        placeholder="Contraseña actual"
                                    />

                                    <InputError
                                        message={errors.current_password}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <Label htmlFor="password">
                                        Nueva contraseña
                                    </Label>

                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                        className={styles.inputField}
                                        autoComplete="new-password"
                                        placeholder="Nueva contraseña"
                                    />

                                    <InputError message={errors.password} />
                                </div>

                                <div className={styles.inputGroup}>
                                    <Label htmlFor="password_confirmation">
                                        Confirmar contraseña
                                    </Label>

                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        className={styles.inputField}
                                        autoComplete="new-password"
                                        placeholder="Confirmar contraseña"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className={styles.actionsContainer}>
                                    <Button
                                        disabled={processing}
                                        data-test="update-password-button"
                                    >
                                        Guardar contraseña
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className={styles.successAlertText}>
                                            Guardado
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
