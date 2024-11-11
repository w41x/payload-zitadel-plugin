import type {PayloadHandler} from '../deps.ts'
import {cookies, SignJWT, decodeJwt} from '../deps.ts'
import type {PayloadConfigWithZitadel, ZitadelIdToken, ZitadelOnSuccess} from '../types.ts'
import {COOKIES} from '../constants.ts'

export const callback = (onSuccess: ZitadelOnSuccess): PayloadHandler => async ({
                                                                                    payload: {config, secret},
                                                                                    query: {code, state}
                                                                                }) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, callbackURL}}}} = config as PayloadConfigWithZitadel

    const cookieStore = await cookies()

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

                cookieStore.delete(COOKIES.pkce)

                cookieStore.set({
                    name: COOKIES.idToken,
                    value: await new SignJWT(decodeJwt<ZitadelIdToken>(id_token))
                        .setProtectedHeader({alg: 'HS256'})
                        .setIssuedAt()
                        .sign(new TextEncoder().encode(secret)),
                    httpOnly: true,
                    path: '/',
                    sameSite: 'lax',
                    maxAge: 900,
                    secure: Deno.env.get('NODE_ENV') == 'production'
                })

                return onSuccess(new URLSearchParams(atob(state as string ?? '')))

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