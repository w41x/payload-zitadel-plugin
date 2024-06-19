'use client'

import * as React from 'react'
// https://github.com/vercel/next.js/issues/46078
// import Image from 'next/image.js'
import {useSession} from 'next-auth/react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {CustomComponent} from 'payload'


export const Avatar: CustomComponent<{ active: boolean }> = ({active}) => {

    const session = useSession()

    const imageUrl = session?.data?.user?.image

    return (imageUrl ?
            <>
                <style>
                    {`
                            .avatar {
                                height: 2rem;
                                width: 2rem;
                            }
                            
                            .avatar:hover {
                                filter: brightness(.8);
                            }
                            
                            .avatar img {
                                object-fit: fill;
                                border-radius: 100%;
                            }
                        `}
                </style>
                <div className="avatar">
                    {/*<Image src={imageUrl} alt="Profile Picture" fill/>*/}
                    {<img src={imageUrl} alt="Profile Picture"/>}
                </div>
            </> :
            <DefaultAccountIcon active={active}/>
    )
}