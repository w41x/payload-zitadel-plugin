'use client'

import React from 'react'
import {useAuth, usePayloadAPI} from '@payloadcms/ui'

export const UserInfoCSR = () => {

    const {user} = useAuth()

    const {data: {user: apiUser}} = usePayloadAPI('/api/users/me')[0]

    return (
        <div>
            <h3>ClientComponent</h3>
            <p>User from useAuth: {JSON.stringify(user)}</p>
            <p>User from REST-API: {JSON.stringify(apiUser)}</p>
        </div>
    )


}
