'use client'

import {usePayloadAPI} from '@payloadcms/ui'
import {ZitadelUser} from '../types.js'

export const useCurrentUser = <T extends ZitadelUser>() => {

    const {data: {user}, isError, isLoading} = usePayloadAPI('/api/users/me')[0]

    return {
        user: user as T | null,
        isError,
        isLoading
    }

}