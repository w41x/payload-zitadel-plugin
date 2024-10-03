'use client'

import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {useAuth} from '@payloadcms/ui'
import {ZitadelUser} from '../types.js'

export const Avatar = ({active}: { active: boolean }) => {

    const {user} = useAuth<ZitadelUser>()

    return (
        user?.image ?
            <>
                <style>{'zitadel-avatar:hover { filter: brightness(1.2); }'}</style>
                <img className="zitadel-avatar" src={user.image} height={25} width={25} alt="Profile Picture" style={{
                    borderRadius: '100%',
                    ...(active ? {filter: 'brightness(.8)'} : {})
                }}/>
            </> :
            <DefaultAccountIcon active={active}/>
    )

}
