import {cookies} from 'next/headers.js'
import {COOKIES} from '../constants.js'
import {ZitadelBaseHandler} from '../types.js'
import {requestRedirect} from '../utils/index.js'

export const authorize: ZitadelBaseHandler = ({issuerURL, clientId}) => async (req) => {

    console.log('authorize handler was called!')

    const codeVerifier = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64url')

    const codeChallenge = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))).toString('base64url')

    const cookieStore = await cookies()

    cookieStore.set({
        ...COOKIES.pkce,
        value: codeVerifier,
        maxAge: 300
    })

    return requestRedirect({req, issuerURL, clientId, invokedBy: 'authorize', codeChallenge})

}
