import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import {COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROUTES} from '../constants.js'
import {ZitadelBaseHandler} from '../types.js'
import {getAuthBaseURL} from '../utils.js'

export const endSession: ZitadelBaseHandler = ({issuerURL, clientId}) => async ({payload: {config}, searchParams}) => {

    console.log('end_session handler was called!')

    const cookieStore = await cookies()

    const logout = cookieStore.get(COOKIES.logout)?.value

    if (!logout) {
        return Response.json({
            status: 'error',
            message: 'logout cookie not found'
        })
    }

    const redirect = new URLSearchParams(atob(logout)).get('redirect')

    if (!redirect) {
        return Response.json({
            status: 'error',
            message: 'logout cookie has wrong format (redirect key not found)'
        })
    }

    cookieStore.delete({
        name: COOKIES.idToken,
        ...COOKIE_CONFIG
    })

    cookieStore.delete({
        name: COOKIES.logout,
        ...COOKIE_CONFIG
    })

    const state = new URLSearchParams(searchParams)
    state.append('invokedBy', 'end_session')

    const endSessionRequest = `${issuerURL}${ENDPOINT_PATHS.end_session}?${new URLSearchParams({
        client_id: clientId,
        post_logout_redirect_uri: getAuthBaseURL(config) + ROUTES.end_session,
        state: btoa(searchParams.toString())
    })}`

    console.log('endSessionRequest: ', endSessionRequest)

    return NextResponse.redirect(endSessionRequest)

}