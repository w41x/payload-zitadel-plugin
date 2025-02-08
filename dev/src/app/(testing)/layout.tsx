import React, {PropsWithChildren} from 'react'
import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: 'Plugin Test',
    description: 'Payload Zitadel Plugin'
}

export default async function RootLayout({children}: PropsWithChildren) {
    return (
        <html>
        <body>
        <main>
            {children}
        </main>
        </body>
        </html>
    )
}
