import {getPayloadHMR} from '@payloadcms/next/utilities'
import {headers} from 'next/headers.js'
import {SanitizedConfig} from 'payload'

export const getCurrentUser = async ({config}: { config: Promise<SanitizedConfig> }) => {
    const payload = await getPayloadHMR({config})
    const {user} = await payload.auth({headers: headers()})
    if (user) {
        return await payload.findByID({...user})
    }
    return null
}