import type {Metadata} from 'next'
import React, {PropsWithChildren} from 'react'

export const metadata: Metadata = {
    title: 'Plugin Test',
    description: 'Payload Zitadel Plugin'
}

export default function RootLayout({children}: PropsWithChildren) {
    return (
        <html>
        <body>{children}</body>
        </html>
    )
}
