import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const styles = {
    headerContainer: "text-center mb-8",
    title: "text-xl font-bold text-[var(--color-sisth)]",
    subtitle: "text-sm text-[var(--color-sisth)]/60 mt-1",
    formContainer: "flex flex-col gap-4 w-full max-w-[360px] mx-auto",
    inputGrid: "grid grid-cols-2 gap-3",
    input: "h-11 w-full rounded-full border-0 bg-[#d9dfe5]/70 focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] shadow-inner px-5 text-sm placeholder:text-[var(--color-sisth)]/60 text-[var(--color-sisth)]",
    selectTrigger: "w-full h-11 rounded-full border-0 bg-[#d9dfe5]/70 shadow-inner px-5 text-sm text-[var(--color-sisth)] focus:ring-1 focus:ring-[var(--color-accent)] hover:bg-[#d9dfe5]/90 transition-colors",
    submitButton: "mt-4 h-11 w-full rounded-full bg-[var(--color-accent)] hover:bg-[#829965] text-white font-bold text-base shadow-md transition-all",
    linkText: "text-xs font-bold text-[var(--color-sisth)]/80 hover:text-[var(--color-sisth)] underline underline-offset-2",
    errorText: "mt-1 px-4 text-xs"
};

type Country = {
    iso2: string;
    name: string;
};

export default function Register() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        // Fetch countries asynchronously to avoid bloating the bundle
        fetch('/country_state_city-data/countries.json')
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error("Error loading countries:", err));
    }, []);

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
                {({ processing, errors }) => {
                    // Trigger Sonner Toasts for any form errors
                    useEffect(() => {
                        if (errors && Object.keys(errors).length > 0) {
                            const firstErrorKey = Object.keys(errors)[0];
                            toast.error(`Error: ${errors[firstErrorKey as keyof typeof errors]}`);
                        }
                    }, [errors]);

                    return (
                        <>
                            <div className={styles.inputGrid}>
                                <div>
                                    <Input id="name" type="text" required autoFocus tabIndex={1} name="name" placeholder="Nombre(s)"
                                        className={styles.input} />
                                    <InputError message={errors.name} className={styles.errorText} />
                                </div>
                                <div>
                                    <Input id="father_lastname" type="text" required tabIndex={2} name="father_lastname" placeholder="Ap. Paterno"
                                        className={styles.input} />
                                    <InputError message={errors.father_lastname} className={styles.errorText} />
                                </div>
                            </div>

                            <div className={styles.inputGrid}>
                                <div>
                                    <Input id="mother_lastname" type="text" tabIndex={3} name="mother_lastname" placeholder="Ap. Materno (Opcional)"
                                        className={styles.input} />
                                    <InputError message={errors.mother_lastname} className={styles.errorText} />
                                </div>
                                <div>
                                    <Input id="username" type="text" required tabIndex={4} name="username" placeholder="Username"
                                        className={styles.input} />
                                    <InputError message={errors.username} className={styles.errorText} />
                                </div>
                            </div>

                            <div>
                                <Input id="email" type="email" required tabIndex={5} autoComplete="email" name="email" placeholder="Correo electrónico"
                                    className={styles.input} />
                                <InputError message={errors.email} className={styles.errorText} />
                            </div>

                            <div className={styles.inputGrid}>
                                <div>
                                    <input type="hidden" name="birthdate" value={date ? format(date, "yyyy-MM-dd") : ""} />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                tabIndex={6}
                                                className={cn(
                                                    styles.selectTrigger,
                                                    "justify-start text-left font-normal border-none",
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
                                    <InputError message={errors.birthdate} className={styles.errorText} />
                                </div>
                                <div>
                                    <Select name="country">
                                        <SelectTrigger className={styles.selectTrigger} tabIndex={7}>
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
                                    <InputError message={errors.country} className={styles.errorText} />
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
                    )
                }}
            </Form>
        </AuthLayout>
    );
}
