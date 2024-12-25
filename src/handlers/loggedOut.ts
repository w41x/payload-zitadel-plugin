import {ZitadelCallbackHandler, ZitadelCallbackQuery} from '../types.js'

export const loggedOut: ZitadelCallbackHandler = (afterLogout) => async ({query}) => {

    const {state} = query as ZitadelCallbackQuery

    return afterLogout(new URLSearchParams(atob(state ?? '')))

}
