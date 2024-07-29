import {PayloadHandler} from 'payload'
import {cookies} from 'next/headers.js'
import {ZitadelOnSuccess} from '../types.js'
import {COOKIES} from '../constants.js'

export const redirect = (onSuccess: ZitadelOnSuccess): PayloadHandler => async () => {

    const cookieStore = cookies()

    const zitadelState = new URLSearchParams(atob(cookieStore.get(COOKIES.state)?.value ?? ''))

    const response = onSuccess(zitadelState)

    response.cookies.delete(COOKIES.state)

    return response

}