'use client'

import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {useAuth, useConfig} from '@payloadcms/ui'
import type {ZitadelCustomConfigSegment} from '../types.ts'

export const Avatar = ({active}: { active: boolean }) => {

    const {user} = useAuth()

    const {config: {admin: {custom}}} = useConfig()

    const {zitadel: {imageFieldName}} = custom as ZitadelCustomConfigSegment

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
