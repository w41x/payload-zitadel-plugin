import type {PropsWithChildren} from 'react'

export default function Layout({children}: PropsWithChildren) {

    return (
        <main>
            {children}
        </main>
    )

}