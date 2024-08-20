'use client'

import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {usePayloadAPI} from '@payloadcms/ui'
import {ZitadelUser} from '../types.js'

export const Avatar = ({active}: { active: boolean }) => {

    const {data, isLoading} = usePayloadAPI('/api/users/me')[0]

    const {user} = data as { user: ZitadelUser }

    return (
        !isLoading && user?.image ?
            <>
                <style>
                    {`
                        .avatar {
                            position: relative;
                            height: 2rem;
                            width: 2rem;
                        }
                        
                        .avatar:hover {
                            filter: brightness(1.2);
                        }
                        
                        .avatar.active {
                            filter: brightness(.8);
                        }
                        
                        .avatar img {
                            border-radius: 100%;
                        }
                    `}
                </style>
                <div className={['avatar', active ? 'active' : ''].join(' ').trim()}>
                    <img src={user.image} alt="Profile Picture" sizes="2rem 2rem"/>
                </div>
            </> :
            <DefaultAccountIcon active={active}/>
    )

}
