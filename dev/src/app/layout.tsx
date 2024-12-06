import type {Metadata} from 'next'
import React from 'react'
import type {PropsWithChildren} from 'react'

export const metadata: Metadata = {
    title: 'Plugin Test',
    description: 'Payload Zitadel Plugin'
}

export default async function RootLayout({children}: PropsWithChildren) {
    return (
        <html>
        <body>{children}</body>
        </html>
    )
}
