import {PayloadHandler} from 'payload'
import {cookies} from 'next/headers.js'
import process from 'node:process'
import jwt from 'jsonwebtoken'
import {PayloadConfigWithZitadel, ZitadelIdToken, ZitadelOnSuccess} from '../types.js'

export const callback = (onSuccess: ZitadelOnSuccess): PayloadHandler => async ({payload, query: {code, state}}) => {

    const {
        secret,
        admin: {custom: {zitadel: {issuerURL, clientId, callbackURL}}}
    } = payload.config as PayloadConfigWithZitadel

    const cookieStore = cookies()

    const code_verifier = cookieStore.get('pkce_code_verifier')?.value

    if (code_verifier) {

        const response = await fetch(new URL(`${issuerURL}/oauth/v2/token`), {
            method: 'POST',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: callbackURL,
                client_id: clientId,
                code_verifier
            })
        })

        if (response.ok) {

            const {id_token} = await response.json()

            if (id_token) {
                cookieStore.set({
                    name: 'id_token',
                    value: jwt.sign(jwt.decode(id_token) as ZitadelIdToken, secret),
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 900,
                    secure: process.env.NODE_ENV == 'production'
                })
                cookieStore.delete('pkce_code_verifier')

                return onSuccess(new URLSearchParams(decodeURIComponent(state as string ?? '')))

            }

            return Response.json({
                status: 'error',
                message: 'token could not be retrieved from the response'
            })

        }

        return Response.json({
            status: 'error',
            message: 'error while communicating with token endpoint'
        })

    }

    return Response.json({
        status: 'error',
        message: 'code verifier not found (associated http-only cookie is empty)'
    })

}