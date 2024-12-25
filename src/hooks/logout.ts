import {NextResponse} from 'next/server.js'
import {CollectionAfterLogoutHook} from 'payload'
import {ROUTES, ENDPOINT_PATHS} from '../constants.js'
import {PayloadConfigWithZitadel} from '../types.js'

export const logout: CollectionAfterLogoutHook = async ({req: {payload: {config}}}) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, authBaseURL}}}} = config as PayloadConfigWithZitadel

    const endSessionRequest = `${issuerURL}${ENDPOINT_PATHS.end_session}?${new URLSearchParams({
        client_id: clientId,
        post_logout_redirect_uri: authBaseURL + ROUTES.logged_out
    })}`

    console.log('endSessionRequest: ', endSessionRequest)

    return NextResponse.redirect(endSessionRequest)

}