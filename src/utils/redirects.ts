import {PayloadHandler} from 'payload'
import {NextResponse} from 'next/server.js'
import {AUTHORIZE_QUERY, ENDPOINT_PATHS, ROUTES} from '../constants.js'
import {ZitadelRequestHandler} from '../types.js'
import {createState, getState} from './state.js'
import {getAuthBaseURL} from './urls.js'

export const defaultRedirect: PayloadHandler = (req) =>
    NextResponse.redirect(req.payload.config.serverURL + (getState(req).redirect ?? ''))

export const requestRedirect: ZitadelRequestHandler = ({req, issuerURL, clientId, invokedBy, codeChallenge}) => {

    const redirectURL = `${issuerURL}${ENDPOINT_PATHS[invokedBy]}?${new URLSearchParams({
        client_id: clientId,
        [`${invokedBy == 'authorize' ? '' : 'post_logout_'}redirect_uri`]: getAuthBaseURL(req.payload.config) + ROUTES.callback,
        state: createState(req, invokedBy),
        ...invokedBy == 'authorize' ? {
            code_challenge: codeChallenge,
            ...AUTHORIZE_QUERY
        } : {}
    })}`

    console.log('requesting redirect to:', redirectURL)

    return NextResponse.redirect(redirectURL)

}