import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import {AUTHORIZE_QUERY, COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROUTES} from '../constants.js'
import {ZitadelBaseHandler} from '../types.js'
import {createState, getAuthBaseURL} from '../utils/index.js'

export const authorize: ZitadelBaseHandler = ({issuerURL, clientId}) => async (req) => {

    console.log('authorize handler was called!')

    const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64url')

    const code_challenge = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code_verifier))).toString('base64url')

    const cookieStore = await cookies()

    cookieStore.set({
        name: COOKIES.pkce,
        value: code_verifier,
        maxAge: 300,
        ...COOKIE_CONFIG
    })

    return NextResponse.redirect(`${issuerURL}${ENDPOINT_PATHS.authorize}?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: getAuthBaseURL(req.payload.config) + ROUTES.callback,
        state: createState(req, 'authorize'),
        code_challenge,
        ...AUTHORIZE_QUERY
    })}`)

}
