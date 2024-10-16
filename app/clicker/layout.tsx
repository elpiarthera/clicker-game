// app/clicker/layout.tsx
'use client'

import { WALLET_MANIFEST_URL } from '@/utils/consts';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <TonConnectUIProvider manifestUrl={WALLET_MANIFEST_URL}>
            {children}
        </TonConnectUIProvider>
    );
}