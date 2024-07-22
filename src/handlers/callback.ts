import {PayloadHandler} from 'payload'
import {cookies} from 'next/headers.js'
import process from 'node:process'
import jwt from 'jsonwebtoken'
import {PayloadConfigWithZitadel, ZitadelIdToken} from '../types.js'
import {NextResponse} from 'next/server.js'
import {COOKIES} from '../constants.js'

export const callback: PayloadHandler = async ({
                                                   payload: {config, secret},
                                                   responseHeaders,
                                                   origin,
                                                   query: {code, state}
                                               }) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, callbackURL}}}} = config as PayloadConfigWithZitadel

    const cookieStore = cookies()

    const code_verifier = cookieStore.get(COOKIES.pkce)?.value

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
                    name: COOKIES.idToken,
                    value: jwt.sign(jwt.decode(id_token) as ZitadelIdToken, secret),
                    httpOnly: true,
                    path: '/',
                    sameSite: 'strict',
                    maxAge: 900,
                    secure: process.env.NODE_ENV == 'production'
                })
                cookieStore.delete('pkce_code_verifier')

                const response = NextResponse.redirect(`${new URL(callbackURL).origin}/admin/login`)
                response.cookies.set({
                    name: COOKIES.state,
                    value: state as string ?? '',
                    httpOnly: true,
                    path: '/',
                    sameSite: 'lax',
                    maxAge: 300,
                    secure: process.env.NODE_ENV == 'production'
                })
                return response

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