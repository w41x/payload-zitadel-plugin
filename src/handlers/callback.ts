import {SignJWT, decodeJwt} from 'jose'
import {cookies} from 'next/headers.js'
import {COOKIE_CONFIG, COOKIES, ENDPOINT_PATHS, ROLES_KEY, ROUTES} from '../constants.js'
import {ZitadelCallbackHandler, ZitadelCallbackQuery, ZitadelCallbackState, ZitadelIdToken} from '../types.js'
import {getAuthBaseURL, getAuthSlug} from '../utils.js'

export const callback: ZitadelCallbackHandler = ({
                                                     issuerURL,
                                                     clientId,
                                                     fields,
                                                     afterLogin,
                                                     afterLogout
                                                 }) => async (req) => {

    console.log('callback handler was called!')

    const {payload, searchParams} = req

    const {config, secret} = payload

    const {code, state: encodedState} = searchParams as ZitadelCallbackQuery

    const state = new URLSearchParams(atob(encodedState ?? '')) as ZitadelCallbackState

    console.log('retrieved callback state:', JSON.stringify(state))

    if (state.invokedBy == 'end_session') {
        return afterLogout(req)
    }

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
        redirect_uri: getAuthBaseURL(config) + ROUTES.callback,
        client_id: clientId,
        code_verifier: codeVerifier
    }

    const tokenEndpoint = issuerURL + ENDPOINT_PATHS.token

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
        [fields.name.name]: decodedIdToken.name,
        [fields.email.name]: decodedIdToken.email,
        [fields.image.name]: decodedIdToken.picture,
        [fields.roles.name]: Object.keys(decodedIdToken[ROLES_KEY] ?? {})
            .map(key => ({[fields.roleFields.name.name]: key}))
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

        const authSlug = getAuthSlug(config)

        const {docs, totalDocs} = await payload.find({
            collection: authSlug,
            where: {
                [fields.id.name]: {
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
                    [fields.id.name]: idpId,
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

    cookieStore.delete({
        name: COOKIES.pkce,
        ...COOKIE_CONFIG
    })

    cookieStore.set({
        name: COOKIES.idToken,
        value: await new SignJWT(decodedIdToken)
            .setProtectedHeader({alg: 'HS256'})
            .setIssuedAt()
            .sign(new TextEncoder().encode(secret)),
        maxAge: 900,
        ...COOKIE_CONFIG
    })

    return afterLogin(req)

}