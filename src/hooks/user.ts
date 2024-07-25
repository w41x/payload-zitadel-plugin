'use client'

import {usePayloadAPI} from '@payloadcms/ui'
import {User} from 'payload'

export const useCurrentUser = <T extends User>() => {

    const {data: {user}, isError, isLoading} = usePayloadAPI('/api/users/me')[0]

    return {
        user: user as T,
        isError,
        isLoading
    }

}