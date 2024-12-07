'use client'

import React from 'react'
import {usePathname} from 'next/navigation.js'
import {useAuth, useConfig} from '@payloadcms/ui'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {formatAdminURL} from '@payloadcms/ui/utilities/formatAdminURL'
import type {ZitadelAvatarProps} from '../../../types.js'

export const Avatar = ({imageFieldName}: ZitadelAvatarProps) => {

    const {
        config: {
            admin: {
                routes: {account: accountRoute}
            },
            routes: {admin: adminRoute}
        }
    } = useConfig()

    const {user} = useAuth()

    const pathname = usePathname()
    const isOnAccountPage = pathname === formatAdminURL({adminRoute, path: accountRoute})

    return (
        user && user[imageFieldName] ?
            <>
                <style>{'zitadel-avatar:hover { filter: brightness(1.2); }'}</style>
                <img className="zitadel-avatar" src={user[imageFieldName]} height={25} width={25} alt="Profile Picture"
                     style={{
                         borderRadius: '100%',
                         ...(isOnAccountPage ? {filter: 'brightness(.8)'} : {})
                     }}/>
            </> :
            <DefaultAccountIcon active={isOnAccountPage}/>
    )

}
