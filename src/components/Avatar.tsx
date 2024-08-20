import * as React from 'react'
import {DefaultAccountIcon} from '@payloadcms/ui/graphics/Account/Default'
import {ServerProps} from 'payload'


export const Avatar = ({user}: ServerProps) =>
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


