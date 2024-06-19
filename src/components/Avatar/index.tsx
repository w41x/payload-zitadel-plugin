/*'use client'

import * as React from 'react'
import {useSession} from 'next-auth/react'
import {CustomComponent} from 'payload'
import {Thumbnail} from '@payloadcms/ui/elements/Thumbnail'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'


export const Avatar: CustomComponent = () => {

    const session = useSession()

    const imageUrl = session?.data?.user?.image

    return imageUrl ? (
        <div className="avatar">
            <Thumbnail fileSrc={imageUrl} size="expand"/>
        </div>
    ) : <DefaultAccountIcon active={false}/>
}*/