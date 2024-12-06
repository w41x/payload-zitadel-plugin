import {jwtVerify, SignJWT} from 'jose'
import {cookies} from 'next/headers.js'
import {COOKIES} from './constants.js'
import type {ZitadelIdToken, ZitadelStrategyType} from './types.js'

export const zitadelStrategy: ZitadelStrategyType = ({
                                                         authSlug,
                                                         fieldsConfig,
                                                         strategyName,
                                                         issuerURL,
                                                         enableAPI,
                                                         apiClientId,
                                                         apiKeyId,
                                                         apiKey
                                                     }) => ({
    name: strategyName,
    authenticate: async ({headers, payload}) => {

        let id, idp_id, id_token

        const cookieStore = await cookies()

        if (enableAPI) {
            // in case of incoming API call from the app
            const authHeader = headers.get('Authorization')
            if (authHeader?.includes('Bearer')) {
                const introspect = await fetch(`${issuerURL}/oauth/v2/introspect`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                        'client_assertion': await new SignJWT()
                            .setProtectedHeader({alg: 'RS256', kid: apiKeyId})
                            .setIssuer(apiClientId)
                            .setAudience(issuerURL)
                            .setSubject(apiClientId)
                            .setIssuedAt()
                            .setExpirationTime('1h')
                            .sign(new TextEncoder().encode(apiKey)),
                        'token': authHeader.split(' ')[1]
                    })
                })
                if (introspect.ok) {
                    const data = await introspect.json()
                    if (data?.active) {
                        idp_id = data.sub
                    }
                }
            }
        }

        // in case of normal browsing
        if (!idp_id && cookieStore.has(COOKIES.idToken)) {
            const {payload: jwtPayload} = await jwtVerify<ZitadelIdToken>(cookieStore.get(COOKIES.idToken)?.value ?? '', new TextEncoder().encode(payload.secret))
            if (jwtPayload.sub) {
                id_token = jwtPayload
                idp_id = jwtPayload.sub
            }
        }

        // search for associated user; if not found, create one
        if (idp_id) {
            const {docs, totalDocs} = await payload.find({
                collection: authSlug,
                where: {
                    [fieldsConfig.id.name]: {
                        equals: idp_id
                    }
                }
            })
            id = totalDocs ? docs[0].id : (await payload.create({
                collection: authSlug,
                data: {
                    [fieldsConfig.id.name]: idp_id
                }
            })).id
        }

        // update user information if possible
        if (id && id_token) {
            await payload.update({
                collection: authSlug,
                id,
                data: {
                    [fieldsConfig.name.name]: id_token.name,
                    [fieldsConfig.email.name]: id_token.email,
                    [fieldsConfig.image.name]: id_token.picture,
                    [fieldsConfig.roles.name]: Object.keys(id_token['urn:zitadel:iam:org:project:roles'] ?? {})
                        .map(key => ({[fieldsConfig.roleFields.name.name]: key}))
                }
            })
        }

        return {
            user: id ? {
                collection: authSlug,
                id
            } : null
        }

    }
})