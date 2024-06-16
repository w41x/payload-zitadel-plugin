'use client'

import * as React from 'react'
import Image from 'next/image.js'
import {useSession} from 'next-auth/react'


export default function Page() {

    const session = useSession()

    const imageUrl = session?.data?.user?.image

    return <>
        <h1>{JSON.stringify(session?.data)}</h1>
        {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> : <h1>No Avatar</h1>}
    </>

}