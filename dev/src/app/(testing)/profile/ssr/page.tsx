import React from 'react'
import {getPayload} from 'payload'
import Image from 'next/image.js'
import config from '@payload-config'
import {headers} from 'next/headers'

export default async function Page() {

    const payload = await getPayload({config})

    const {user} = await payload.auth({headers: await headers()})

    const fullUser = user ? await payload.findByID({collection: 'users', id: user.id}) : null

    return <>
        <h1>{JSON.stringify(fullUser)}</h1>
        {fullUser?.image ? <Image src={fullUser.image} alt="Profile Picture" width={100} height={100}/> :
            <h1>No Avatar</h1>}
    </>

}
