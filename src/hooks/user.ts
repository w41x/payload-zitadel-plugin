'use client'

import {usePayloadAPI} from '@payloadcms/ui'

export const useCurrentUser = () => {

    const {data: {user}, isError, isLoading} = usePayloadAPI('/api/users/me')[0]

    return {
        user,
        isError,
        isLoading
    }

}