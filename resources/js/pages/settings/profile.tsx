import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
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
import { useEffect, useState, useRef } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const styles = {
    container: "space-y-6",
    formBase: "space-y-8",

    appearanceSection: "space-y-4",
    bannerBox: "h-32 w-full rounded-2xl bg-indigo-500 flex items-end p-4 border border-gray-200 dark:border-stone-800",
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

    selectTrigger: "flex w-full h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 mt-1",
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

type Country = {
    iso2: string;
    name: string;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [countries, setCountries] = useState<Country[]>([]);
    const user = auth.user as any;
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const initialDate = user.birthdate ? new Date(user.birthdate) : undefined;
    const [date, setDate] = useState<Date | undefined>(initialDate);

    useEffect(() => {
        fetch('/country_state_city-data/countries.json')
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error("Error loading countries:", err));
    }, []);

    // Create the form with default values mapped!
    const formOptions: any = {
        name: user.name,
        father_lastname: user.father_lastname || '',
        mother_lastname: user.mother_lastname || '',
        email: user.email,
        username: user.username || '',
        country: user.country || 'MX',
        birthdate: user.birthdate || '',
        avatar: null as File | null
    };

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        ...formOptions,
        _method: 'patch',
    });

    // Handle File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setData('avatar', file);
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
        });
    };

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

                    <form onSubmit={onSubmit} className={styles.formBase}>
                        {(() => {
                            useEffect(() => {
                                if (errors && Object.keys(errors).length > 0) {
                                    const firstErrorKey = Object.keys(errors)[0];
                                    toast.error(`Error: ${errors[firstErrorKey as keyof typeof errors]}`);
                                }
                            }, [errors]);
                            
                            return (
                            <>
                                <div className={styles.appearanceSection}>
                                    <Label>Apariencia del Perfil</Label>
                                    <div className={styles.bannerBox}>
                                        <div className={styles.avatarWrapper}>
                                            <div className={styles.avatarGroup} onClick={() => fileInputRef.current?.click()}>
                                                <input 
                                                    type="file" 
                                                    id="avatar" 
                                                    name="avatar" 
                                                    ref={fileInputRef} 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    onChange={handleFileChange} 
                                                />
                                                <div className={styles.avatarContainer}>
                                                    <img src={avatarPreview || user.avatar || "/imgs/assets/wc-balls/1950.png"} alt="Avatar" className={styles.avatarImage} />
                                                </div>
                                                <div className={styles.avatarOverlay}>
                                                    <span className={styles.avatarEditText}>Editar</span>
                                                </div>
                                            </div>
                                            <div className={styles.avatarContextWrapper}>
                                                <div className={styles.avatarTitle}>Foto de perfil</div>
                                                <div className={styles.avatarSubtitle}>Haz clic para modificar</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formContent}>
                                    <div className={styles.grid1x3}>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="name">Nombre(s)</Label>
                                            <Input id="name" className={styles.inputField} defaultValue={user.name} name="name" required autoComplete="name" placeholder="Tu nombre" />
                                            <InputError className="mt-2" message={errors.name} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="father_lastname">Ap. Paterno</Label>
                                            <Input id="father_lastname" className={styles.inputField} defaultValue={user.father_lastname || ''} name="father_lastname" required placeholder="Tu apellido paterno" />
                                            <InputError className="mt-2" message={errors.father_lastname} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="mother_lastname">Ap. Materno</Label>
                                            <Input id="mother_lastname" className={styles.inputField} defaultValue={user.mother_lastname || ''} name="mother_lastname" placeholder="Tu apellido materno" />
                                            <InputError className="mt-2" message={errors.mother_lastname} />
                                        </div>
                                    </div>

                                    <div className={styles.grid1x2}>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input id="email" type="email" className={styles.inputField} defaultValue={user.email} name="email" required autoComplete="email" />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="username">Nombre de Usuario (Username)</Label>
                                            <Input id="username" className={styles.inputField} defaultValue={user.username || ''} name="username" required autoComplete="username" />
                                            <InputError className="mt-2" message={errors.username} />
                                        </div>
                                    </div>

                                    <div className={styles.grid1x2}>
                                        <div className={styles.inputGroup}>
                                            <Label>Fecha de nacimiento</Label>
                                            <input type="hidden" name="birthdate" value={date ? format(date, "yyyy-MM-dd") : ""} />
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            styles.selectTrigger,
                                                            "justify-start text-left font-normal border-input hover:bg-transparent",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "dd/MM/yyyy") : <span>Nacimiento</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        captionLayout="dropdown"
                                                        fromYear={1920}
                                                        toYear={new Date().getFullYear()}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError className="mt-2" message={errors.birthdate} />
                                        </div>
                                        <div className={styles.inputGroup}>
                                            <Label htmlFor="country">País de origen</Label>
                                            <Select name="country" defaultValue={user.country || 'MX'}>
                                                <SelectTrigger className={styles.selectTrigger}>
                                                    <SelectValue placeholder="País de origen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {countries.length > 0 ? (
                                                            countries.map(c => (
                                                                <SelectItem key={c.iso2} value={c.iso2}>{c.name}</SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="MX">Mexico</SelectItem>
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.country} />
                                        </div>
                                    </div>
                                </div>

                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <div>
                                        <p className={styles.verifyWarningContainer}>
                                            Tu correo electrónico no está verificado.{' '}
                                            <Link href={send()} as="button" className={styles.verifyLinkText}>
                                                Haz clic aquí para reenviar el correo de verificación.
                                            </Link>
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <div className={styles.verifySuccessBox}>
                                                Se ha enviado un nuevo enlace de verificación a tu correo.
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className={styles.actionsContainer}>
                                    <Button disabled={processing} data-test="update-profile-button">
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
                                            Guardado exitosamente.
                                        </p>
                                    </Transition>
                                </div>
                            </>
                            );
                        })()}
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
