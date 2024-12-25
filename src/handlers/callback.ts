import {SignJWT, decodeJwt} from 'jose'
import {cookies} from 'next/headers.js'
import type {PayloadHandler} from 'payload'
import {COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROLES_KEY, ROUTES} from '../constants.js'
import {PayloadConfigWithZitadel, ZitadelCallbackHandler, ZitadelCallbackQuery, ZitadelIdToken} from '../types.js'

export const callback: ZitadelCallbackHandler = (afterLogin): PayloadHandler => async ({payload, query}) => {

    const {config, secret} = payload

    const {code, state} = query as ZitadelCallbackQuery

    const {
        admin: {
            custom: {
                zitadel: {
                    issuerURL,
                    clientId,
                    authSlug,
                    authBaseURL,
                    fieldsConfig
                }
            }
        }
    } = config as PayloadConfigWithZitadel

    const tokenEndpoint = issuerURL + ENDPOINT_PATHS.token

    const cookieStore = await cookies()

    const codeVerifier = cookieStore.get(COOKIES.pkce)?.value

    if (!code) {
        return Response.json({
            status: 'error',
            message: 'no code provided to verify'
        })
    }

    if (!codeVerifier) {
        return Response.json({
            status: 'error',
            message: 'code verifier not found (associated http-only cookie is empty)'
        })
    }

    const tokenQueryData = {
        grant_type: 'authorization_code',
        code,
        redirect_uri: authBaseURL + ROUTES.callback,
        client_id: clientId,
        code_verifier: codeVerifier
    }

    const tokenResponse = await fetch(new URL(tokenEndpoint), {
        method: 'POST',
        body: new URLSearchParams(tokenQueryData)
    })

    if (!tokenResponse.ok) {
        return Response.json({
            status: 'error',
            message: 'error while communicating with token endpoint',
            details: {
                tokenEndpoint,
                tokenQuery: tokenQueryData,
                tokenResponseCode: `${tokenResponse.status} - ${tokenResponse.statusText}`
            }
        })
    }

    const tokenJson = await tokenResponse.json()

    const {id_token: idToken} = tokenJson

    if (!idToken) {
        return Response.json({
            status: 'error',
            message: 'token could not be retrieved from this response',
            details: {
                responseData: tokenJson
            }
        })
    }

    let decodedIdToken

    try {

        decodedIdToken = decodeJwt<ZitadelIdToken>(idToken)

    } catch (e) {

        return Response.json({
            status: 'error',
            message: `error during decoding: ${JSON.stringify(e)}`,
            details: {
                idToken
            }
        })

    }

    const idpId = decodedIdToken.sub

    const userData = {
        [fieldsConfig.name.name]: decodedIdToken.name,
        [fieldsConfig.email.name]: decodedIdToken.email,
        [fieldsConfig.image.name]: decodedIdToken.picture,
        [fieldsConfig.roles.name]: Object.keys(decodedIdToken[ROLES_KEY] ?? {})
            .map(key => ({[fieldsConfig.roleFields.name.name]: key}))
    }

    if (!idpId) {
        return Response.json({
            status: 'error',
            message: 'token is not complete (id not found)',
            details: {
                idToken,
                decodedIdToken,
                idpId
            }
        })
    }

    try {

        const {docs, totalDocs} = await payload.find({
            collection: authSlug,
            where: {
                [fieldsConfig.id.name]: {
                    equals: idpId
                }
            }
        })

        if (totalDocs) {
            await payload.update({
                collection: authSlug,
                id: docs[0].id,
                data: userData
            })
        } else {
            await payload.create({
                collection: authSlug,
                data: {
                    [fieldsConfig.id.name]: idpId,
                    ...userData
                }
            })
        }

    } catch (e) {

        return Response.json({
            status: 'error',
            message: `error while creating/updating user: ${JSON.stringify(e)}`,
            details: {
                idpId
            }
        })

    }

    cookieStore.delete(COOKIES.pkce)

    cookieStore.set({
        name: COOKIES.idToken,
        value: await new SignJWT(decodedIdToken)
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .sign(new TextEncoder().encode(secret)),
        maxAge: 900,
        ...COOKIE_CONFIG
    })

    return afterLogin(new URLSearchParams(atob(state ?? '')))

}