'use client'
import {PropsWithChildren} from 'react'
import {SessionProvider} from 'next-auth/react'

export default function Layout({children}: PropsWithChildren) {
    return <SessionProvider>
        <main>
            {children}
        </main>
    </SessionProvider>
}