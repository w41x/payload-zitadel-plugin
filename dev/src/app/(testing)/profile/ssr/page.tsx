import * as React from 'react'
import Image from 'next/image.js'
import {auth} from '@/config/zitadel-plugin'


export default async function Page() {

    const session = await auth()

    const imageUrl = session?.user?.image

    return <>
        <h1>{JSON.stringify(session)}</h1>
        {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> : <h1>No Avatar</h1>}
    </>

}