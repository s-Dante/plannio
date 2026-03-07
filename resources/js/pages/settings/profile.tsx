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
import type { BreadcrumbItem } from '@/types';

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
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de Perfil" />

            <h1 className="sr-only">Configuración de Perfil</h1>

            <SettingsLayout>
                <div className="space-y-6">
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
                        className="space-y-8"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                {/* Avatar & Cover Mockup Area */}
                                <div className="space-y-4">
                                    <Label>Apariencia del Perfil</Label>
                                    <div className="h-32 w-full rounded-2xl bg-indigo-500 relative flex items-end p-4 border border-gray-200 dark:border-stone-800">
                                        <div className="flex items-center gap-4 relative z-10 -mb-10">
                                            <div className="relative group cursor-pointer">
                                                <div className="h-20 w-20 rounded-full bg-white dark:bg-[#111214] overflow-hidden border-[3px] border-white dark:border-[#111214] shadow-sm flex items-center justify-center">
                                                    <img src="/imgs/assets/wc-balls/1950.png" alt="Avatar" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-semibold">Editar</span>
                                                </div>
                                            </div>
                                            <div className="pb-2">
                                                <div className="text-sm font-semibold text-white drop-shadow-md">Foto de perfil</div>
                                                <div className="text-xs text-white/80 drop-shadow-md">Haz clic para cambiar</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Row 1: Nombre, Paterno, Materno */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nombre(s)</Label>
                                            <Input id="name" className="mt-1 block w-full" defaultValue={auth.user.name} name="name" required autoComplete="name" placeholder="Tu nombre" />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="apellido_paterno">Ap. Paterno</Label>
                                            <Input id="apellido_paterno" className="mt-1 block w-full" defaultValue="" name="apellido_paterno" required placeholder="Tu apellido paterno" />
                                            {/* Error handled by backend... */}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="apellido_materno">Ap. Materno</Label>
                                            <Input id="apellido_materno" className="mt-1 block w-full" defaultValue="" name="apellido_materno" required placeholder="Tu apellido materno" />
                                            {/* Error handled by backend... */}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Row 2: Correo, Username */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input id="email" type="email" className="mt-1 block w-full" defaultValue={auth.user.email} name="email" required autoComplete="email" placeholder="tucorreo@ejemplo.com" />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="username">Nombre de Usuario (Username)</Label>
                                            <Input id="username" className="mt-1 block w-full" defaultValue="@omarfer" name="username" required autoComplete="username" placeholder="@tu_usuario" />
                                            <InputError className="mt-2" message={errors.username} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Row 3: Nacimiento y País */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                                            <Input id="birth_date" type="date" className="mt-1 block w-full" max={new Date().toISOString().split("T")[0]} name="birth_date" required placeholder="dd/mm/aaaa" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="country">País de origen</Label>
                                            <select id="country" name="country" required className="flex w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1" defaultValue="MX">
                                                <option value="" disabled className="text-muted-foreground">Selecciona...</option>
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
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Tu correo electrónico no está verificado.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Haz clic aquí para reenviar el correo de verificación.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-green-600">
                                                        Se ha enviado un nuevo enlace de verificación a tu correo.
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
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
                                        <p className="text-sm text-neutral-600">
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
