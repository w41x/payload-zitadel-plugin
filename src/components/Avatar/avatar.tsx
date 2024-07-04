'use client'

import * as React from 'react'
// https://github.com/vercel/next.js/issues/46078
// import Image from 'next/image.js'
import Image from 'next/image.js'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {CustomComponent} from 'payload'
import {NextAuthResult} from 'next-auth'


export const _Avatar: CustomComponent<{ auth: NextAuthResult['auth'], active: boolean }> = async ({auth, active}) => {

    const session = await auth()

    const imageUrl = session?.user?.image

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