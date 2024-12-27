import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import {COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROUTES} from '../constants.js'
import {ZitadelBaseHandler} from '../types.js'
import {createState, getAuthBaseURL} from '../utils/index.js'

export const endSession: ZitadelBaseHandler = ({issuerURL, clientId}) => async (req) => {

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

    const endSessionRequest = `${issuerURL}${ENDPOINT_PATHS.end_session}?${new URLSearchParams({
        client_id: clientId,
        post_logout_redirect_uri: getAuthBaseURL(req.payload.config) + ROUTES.end_session,
        state: createState(req, 'end_session')
    })}`

    console.log('endSessionRequest: ', endSessionRequest)

    return NextResponse.redirect(endSessionRequest)

}