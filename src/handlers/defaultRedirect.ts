import {PayloadHandler} from 'payload'
import {NextResponse} from 'next/server.js'
import {ZitadelCallbackQuery, ZitadelCallbackState} from '../types.js'

export const defaultRedirect: PayloadHandler = ({payload: {config: {serverURL}}, searchParams}) => {

    const {state: encodedState} = searchParams as ZitadelCallbackQuery

    const state = new URLSearchParams(atob(encodedState ?? '')) as ZitadelCallbackState

    return NextResponse.redirect(serverURL + (state.redirect ?? ''))

}