import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import {CollectionAfterLogoutHook} from 'payload'
import {COOKIES, ROUTES, ENDPOINT_PATHS} from '../constants.js'
import {PayloadConfigWithZitadel} from '../types.js'

export const logout: CollectionAfterLogoutHook = async ({req: {payload: {config}}}) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, authBaseURL}}}} = config as PayloadConfigWithZitadel

    (await cookies()).delete(COOKIES.idToken)

    const endSessionRequest = `${issuerURL}${ENDPOINT_PATHS.end_session}?${new URLSearchParams({
        client_id: clientId,
        post_logout_redirect_uri: authBaseURL + ROUTES.logged_out
    })}`

    return NextResponse.redirect(endSessionRequest)

}