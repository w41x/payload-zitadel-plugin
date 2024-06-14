import {getServerSession, User} from 'next-auth'
import {authOptions} from './options.js'
import jwt from 'jsonwebtoken'
import {ZitadelStrategyType} from './types.js'

export const zitadelStrategy: ZitadelStrategyType = ({
                                                         authSlug,
                                                         associatedIdFieldName,
                                                         internalProviderName,
                                                         issuerUrl,
                                                         clientId,
                                                         enableAPI,
                                                         apiClientId,
                                                         apiKeyId,
                                                         apiKey
                                                     }) => ({
    name: internalProviderName,
    authenticate: async ({headers, payload}) => {
        let idp_id

        if (enableAPI) {
            // in case of incoming API call from the app
            const authHeader = headers.get('Authorization')
            if (authHeader?.includes('Bearer')) {
                const introspect = await fetch(`${process.env.ZITADEL_URL}/oauth/v2/introspect`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                        'client_assertion': jwt.sign({}, apiKey, {
                            algorithm: 'RS256',
                            audience: issuerUrl,
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
        if (!idp_id) {
            const session = await getServerSession(authOptions({internalProviderName, issuerUrl, clientId}))
            if (session?.user)
                idp_id = (session?.user as User & { id: string }).id
        }

        // search for associated user; if not found, create one
        if (idp_id) {
            const {docs} = await payload.find({
                collection: authSlug,
                where: {
                    [associatedIdFieldName]: {
                        equals: idp_id
                    }
                }
            })
            const id = docs.length ? docs[0].id : (await payload.create({
                collection: authSlug,
                data: {
                    [associatedIdFieldName]: idp_id
                }
            })).id
            return {
                collection: authSlug,
                id,
                email: ''
            }
        }

        // Authentication failed
        return null
    }
})