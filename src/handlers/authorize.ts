import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import type {PayloadHandler} from 'payload'
import {AUTHORIZE_QUERY, COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROUTES} from '../constants.js'
import type {PayloadConfigWithZitadel} from '../types.js'

export const authorize: PayloadHandler = async ({searchParams, payload: {config}}) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, authBaseURL}}}} = config as PayloadConfigWithZitadel

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
        redirect_uri: authBaseURL + ROUTES.callback,
        state: btoa(searchParams.toString()),
        code_challenge,
        ...AUTHORIZE_QUERY
    })}`)

}
