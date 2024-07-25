import {getPayloadHMR} from '@payloadcms/next/utilities'
import {headers} from 'next/headers.js'
import {SanitizedConfig, User} from 'payload'

export const getCurrentUser = async <T extends User>({config}: { config: Promise<SanitizedConfig> }) => {

    const payload = await getPayloadHMR({config})

    const {user} = await payload.auth({headers: headers()})

    return user ? (await payload.findByID({...user})) as T : null

}