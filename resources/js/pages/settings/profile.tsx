import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem, SharedData } from '@/types';

const styles = {
    container: "space-y-6",
    formBase: "space-y-8",

    appearanceSection: "space-y-4",
    bannerBox: "h-32 w-full rounded-2xl bg-indigo-500 relative flex items-end p-4 border border-gray-200 dark:border-stone-800",
    avatarWrapper: "flex items-center gap-4 relative z-10 -mb-10",
    avatarGroup: "relative group cursor-pointer",
    avatarContainer: "h-20 w-20 rounded-full bg-white dark:bg-[#111214] overflow-hidden border-[3px] border-white dark:border-[#111214] shadow-sm flex items-center justify-center",
    avatarImage: "h-full w-full object-cover",
    avatarOverlay: "absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
    avatarEditText: "text-white text-xs font-semibold",
    avatarContextWrapper: "pb-2",
    avatarTitle: "text-sm font-semibold text-white drop-shadow-md",
    avatarSubtitle: "text-xs text-white/80 drop-shadow-md",

    formContent: "pt-8 space-y-6",
    grid1x3: "grid grid-cols-1 md:grid-cols-3 gap-6",
    grid1x2: "grid grid-cols-1 md:grid-cols-2 gap-6",
    inputGroup: "grid gap-2",
    inputField: "mt-1 block w-full",

    selectField: "flex w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1",
    selectPlaceholder: "text-muted-foreground",

    verifyWarningContainer: "-mt-4 text-sm text-muted-foreground",
    verifyLinkText: "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
    verifySuccessBox: "mt-2 text-sm font-medium text-green-600",

    actionsContainer: "flex items-center gap-4",
    successAlertText: "text-sm text-neutral-600"
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuraciones',
        href: edit(),
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de Perfil" />

            <h1 className="sr-only">Configuración de Perfil</h1>

            <SettingsLayout>
                <div className={styles.container}>
                    <Heading
                        variant="small"
                        title="Información del Perfil"
                        description="Actualiza tu nombre, usuario y datos de contacto."
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className={styles.formBase}
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className={styles.appearanceSection}>
                                    <Label>Apariencia del Perfil</Label>
                                    <div className={styles.bannerBox}>
                                        <div className={styles.avatarWrapper}>
                                            <div className={styles.avatarGroup}>
                                                <div className={styles.avatarContainer}>
                                                    <img src="/imgs/assets/wc-balls/1950.png" alt="Avatar" className={styles.avatarImage} />
                                                </div>
                                                <div className={styles.avatarOverlay}>
                                                    <span className={styles.avatarEditText}>Editar</span>
                                                </div>
                                            </div>
                                            <div className={styles.avatarContextWrapper}>
                                                <div className={styles.avatarTitle}>Foto de perfil</div>
                                                <div className={styles.avatarSubtitle}>Haz clic para cambiar</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formContent}>
                                    <div className={styles.grid1x3}>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="name">Nombre(s)</Label>
                                            <Input id="name" className={styles.inputField} defaultValue={auth.user.name} name="name" required autoComplete="name" placeholder="Tu nombre" />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="apellido_paterno">Ap. Paterno</Label>
                                            <Input id="apellido_paterno" className={styles.inputField} defaultValue="" name="apellido_paterno" required placeholder="Tu apellido paterno" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="apellido_materno">Ap. Materno</Label>
                                            <Input id="apellido_materno" className={styles.inputField} defaultValue="" name="apellido_materno" required placeholder="Tu apellido materno" />
                                        </div>
                                    </div>

                                    <div className={styles.grid1x2}>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input id="email" type="email" className={styles.inputField} defaultValue={auth.user.email} name="email" required autoComplete="email" placeholder="tucorreo@ejemplo.com" />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="username">Nombre de Usuario (Username)</Label>
                                            <Input id="username" className={styles.inputField} defaultValue="@omarfer" name="username" required autoComplete="username" placeholder="@tu_usuario" />
                                            <InputError className="mt-2" message={errors.username} />
                                        </div>
                                    </div>

                                    <div className={styles.grid1x2}>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                                            <Input id="birth_date" type="date" className={styles.inputField} max={new Date().toISOString().split("T")[0]} name="birth_date" required placeholder="dd/mm/aaaa" />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="country">País de origen</Label>
                                            <select id="country" name="country" required className={styles.selectField} defaultValue="MX">
                                                <option value="" disabled className={styles.selectPlaceholder}>Selecciona...</option>
                                                <option value="MX">Mexico</option>
                                                <option value="US">Estados Unidos</option>
                                                <option value="ES">España</option>
                                                <option value="OTROC">Otro (Pendiente cargar JSON)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className={styles.verifyWarningContainer}>
                                                Tu correo electrónico no está verificado.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className={styles.verifyLinkText}
                                                >
                                                    Haz clic aquí para reenviar el correo de verificación.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className={styles.verifySuccessBox}>
                                                        Se ha enviado un nuevo enlace de verificación a tu correo.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                <div className={styles.actionsContainer}>
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Guardar Cambios
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

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
