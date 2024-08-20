import * as React from 'react'
import Image from 'next/image.js'
import config from '@payload-config'
import {getPayloadHMR} from '@payloadcms/next/utilities'
import {headers} from 'next/headers'

export default async function Page() {

    const payload = await getPayloadHMR({config})

    const {user} = await payload.auth({headers: headers()})

    const imageUrl = user?.image as string

    return <>
        <h1>{JSON.stringify(user)}</h1>
        {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> : <h1>No Avatar</h1>}
    </>

}
