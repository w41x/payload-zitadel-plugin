'use client'

import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {useAuth} from '@payloadcms/ui'

export const Avatar = ({active, imageFieldName}: { active: boolean, imageFieldName: string }) => {

    const {user} = useAuth()

    return (
        user && user[imageFieldName] ?
            <>
                <style>{'zitadel-avatar:hover { filter: brightness(1.2); }'}</style>
                <img className="zitadel-avatar" src={user[imageFieldName]} height={25} width={25} alt="Profile Picture"
                     style={{
                         borderRadius: '100%',
                         ...(active ? {filter: 'brightness(.8)'} : {})
                     }}/>
            </> :
            <DefaultAccountIcon active={active}/>
    )

}
