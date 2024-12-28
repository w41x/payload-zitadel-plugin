import {cookies} from 'next/headers.js'
import {COOKIES} from '../constants.js'
import {ZitadelBaseHandler} from '../types.js'
import {requestRedirect} from '../utils/index.js'

export const endSession: ZitadelBaseHandler = ({issuerURL, clientId}) => async (req) => {

    console.log('end_session handler was called!')

    const cookieStore = await cookies()

    if (cookieStore.get(COOKIES.logout.name)?.value !== COOKIES.logout.value) {
        return Response.json({
            status: 'error',
            message: 'logout cookie not properly set or not found'
        })
    }

    [COOKIES.idToken, COOKIES.logout].forEach(cookie => cookieStore.delete(cookie))

    return requestRedirect({req, issuerURL, clientId, invokedBy: 'end_session'})

}