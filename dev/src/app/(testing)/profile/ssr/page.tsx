import * as React from 'react'
import Image from 'next/image.js'
import config from '@payload-config'
import {getCurrentUser} from 'payload-zitadel-plugin'

export default async function Page() {

    const user = await getCurrentUser({config})
    const imageUrl = user?.image as string

    return <>
        <h1>{JSON.stringify(user)}</h1>
        {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> : <h1>No Avatar</h1>}
    </>

}
