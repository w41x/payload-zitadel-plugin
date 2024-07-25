'use client'

import * as React from 'react'
import Image from 'next/image.js'
import {useCurrentUser} from 'payload-zitadel-plugin/hooks'
import {User} from '@payload-types'

export default function Page() {

    const {user, isLoading} = useCurrentUser<User>()

    const imageUrl = user?.image

    return <>
        <h1>{isLoading ? 'loading...' : JSON.stringify(user)}</h1>
        {!isLoading && imageUrl ? <Image src={imageUrl} alt="Profile Picture" width={100} height={100}/> :
            <h1>No Avatar</h1>}
    </>

}