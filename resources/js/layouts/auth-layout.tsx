import AuthLayoutTemplate from '@/layouts/auth/auth-floating-layout';

export default function AuthLayout({
    children,
    title,
    description,
    imageSrc,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description?: string;
    imageSrc?: string;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} imageSrc={imageSrc} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
