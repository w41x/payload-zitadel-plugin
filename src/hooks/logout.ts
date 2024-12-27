import {cookies} from 'next/headers.js'
import {CollectionAfterLogoutHook} from 'payload'
import {COOKIES, COOKIE_CONFIG} from '../constants.js'

export const logout: CollectionAfterLogoutHook = async () => {

    console.log('afterLogout hook was called!')

    const cookieStore = await cookies()

    cookieStore.set({
        name: COOKIES.logout,
        value: 'true',
        ...COOKIE_CONFIG
    })

}