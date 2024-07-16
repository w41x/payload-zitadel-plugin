'use client'

import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {Image} from 'next/dist/client/image-component.js'
import {useAuth} from '@payloadcms/ui'


export const Avatar = () => {

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
                    <Image src={user.image} alt="Profile Picture" fill sizes="2rem 2rem"/>
                </div>
            </> :
            <DefaultAccountIcon active={false}/>
    )

}