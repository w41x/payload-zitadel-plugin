import {cookies} from 'next/headers.js'
import {COOKIES} from '../constants.js'
import {ZitadelCallbackHandler, ZitadelCallbackQuery} from '../types.js'

export const loggedOut: ZitadelCallbackHandler = (afterLogout) => async ({query}) => {

    (await cookies()).delete(COOKIES.idToken)

    const {state} = query as ZitadelCallbackQuery

    return afterLogout(new URLSearchParams(atob(state ?? '')))

}
