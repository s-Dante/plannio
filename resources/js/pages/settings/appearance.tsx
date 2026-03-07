import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';

const styles = {
    container: "space-y-6",
    srOnlyTitle: "sr-only"
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Configuración de aspecto',
        href: editAppearance(),
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración de aspecto" />

            <h1 className={styles.srOnlyTitle}>Configuración de aspecto</h1>

            <SettingsLayout>
                <div className={styles.container}>
                    <Heading
                        variant="small"
                        title="Aspecto Visual"
                        description="Actualiza la configuración de aspecto de tu cuenta"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
