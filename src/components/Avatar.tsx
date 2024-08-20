'use client'

import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {useAuth} from '@payloadcms/ui'
import {ZitadelUser} from '../types.js'


export const Avatar = () => {

    const {user} = useAuth<ZitadelUser>()

    return (
        user?.image ?
            <>
                <style>
                    {`
                            .avatar {
                                position: relative;
                                height: 2rem;
                                width: 2rem;
                            }
                            
                            .avatar:hover {
                                filter: brightness(.8);
                            }
                            
                            .avatar img {
                                border-radius: 100%;
                            }
                        `}
                </style>
                <div className="avatar">
                    <img src={user.image} alt="Profile Picture" sizes="2rem 2rem"/>
                </div>
            </> :
            <DefaultAccountIcon active={false}/>
    )

}
