'use client'

import * as React from 'react'
import Image from 'next/image.js'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {useSession} from 'next-auth/react'


export const Avatar = (props: { active: boolean }) => {

    const session = useSession()

    const imageUrl = session?.data?.user?.image

    return imageUrl ? (
        <div className="avatar">
            <Image.default src={imageUrl} alt="Profile Picture" fill/>
        </div>
    ) : <DefaultAccountIcon active={props.active}/>
}