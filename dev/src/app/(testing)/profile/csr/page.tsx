'use client'

import * as React from 'react'
import Image from 'next/image.js'
import {usePayloadAPI} from '@payloadcms/ui'
import {User} from '@payload-types'

export default function Page() {

    const {data: {user}, isLoading} = usePayloadAPI('/api/users/me')[0]

    const imageUrl = isLoading ? null : (user as User).image

    return <>
        <h1>{isLoading ? 'loading...' : JSON.stringify(user)}</h1>
        {imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> :
            <h1>No Avatar</h1>}
    </>

}