// app/admin/layout.tsx
import { headers } from 'next/headers';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const isAdminAccessEnabled = process.env.ACCESS_ADMIN === 'true';
    const isAuthorized = isLocalhost && isAdminAccessEnabled;

    if (!isAuthorized) {
        return <div className="text-white">Unauthorized</div>;
    }
    return (
        <>
            {children}
        </>
    );
}
