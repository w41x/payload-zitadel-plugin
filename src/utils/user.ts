import {getPayloadHMR} from '@payloadcms/next/utilities'
import {headers} from 'next/headers.js'
import {SanitizedConfig} from 'payload'
import {ZitadelUser} from '../types.js'

export const getCurrentUser = async <T extends ZitadelUser>({config}: { config: Promise<SanitizedConfig> }) => {

    const payload = await getPayloadHMR({config})

    const {user} = await payload.auth({headers: headers()})

    return user ? (await payload.findByID({...user})) as T : null

}