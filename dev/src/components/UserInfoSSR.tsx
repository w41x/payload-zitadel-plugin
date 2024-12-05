import React from 'react'
import type {ServerProps} from 'payload'

export const UserInfoSSR = async ({user, payload}: ServerProps) => {

    const fullUser = user ? await payload.findByID({collection: 'users', id: user.id}) : null

    return (
        <div>
            <h3>ServerComponent</h3>
            <p>User from ServerProps: {JSON.stringify(user)}</p>
            <p>User from Local-API: {JSON.stringify(fullUser)}</p>
        </div>
    )

}