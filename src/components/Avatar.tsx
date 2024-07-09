'use client'

import * as React from 'react'
import Image from 'next/image.js'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {CustomComponent} from 'payload'
import {useAuth} from '@payloadcms/ui'


export const Avatar: CustomComponent<{ active: boolean }> = ({active}) => {

    const {user} = useAuth()

    return (user?.image ?
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
                    <Image.default src={user.image} alt="Profile Picture" fill sizes="2rem 2rem"/>
                </div>
            </> :
            <DefaultAccountIcon active={active}/>
    )
}