import {ZitadelIdToken, ZitadelStrategyType} from './types.js'
import jwt from 'jsonwebtoken'
import {cookies} from 'next/headers.js'
import {COOKIES} from './constants.js'

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
                        'client_assertion': jwt.sign({}, apiKey, {
                            algorithm: 'RS256',
                            audience: issuerURL,
                            expiresIn: '1h',
                            issuer: apiClientId,
                            keyid: apiKeyId,
                            subject: apiClientId
                        }),
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
            id_token = jwt.verify(cookieStore.get(COOKIES.idToken)?.value ?? '', payload.secret) as ZitadelIdToken
            idp_id = id_token.sub
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