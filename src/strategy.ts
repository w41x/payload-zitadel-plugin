import {jwtVerify, SignJWT} from 'jose'
import {cookies} from 'next/headers.js'
import {TypeWithID} from 'payload'
import {COOKIES, ENDPOINT_PATHS} from './constants.js'
import type {ZitadelIdToken, ZitadelStrategy} from './types.js'

export const zitadelStrategy: ZitadelStrategy = ({
                                                     strategyName,
                                                     authSlug,
                                                     fieldsConfig,
                                                     issuerURL,
                                                     enableAPI,
                                                     apiClientId,
                                                     apiKeyId,
                                                     apiKey
                                                 }) => ({
    name: strategyName,
    authenticate: async ({headers, payload}) => {

        let idp_id
        let user: TypeWithID | null = null

        const cookieStore = await cookies()

        if (enableAPI) {
            // in case of API call
            const authHeader = headers.get('Authorization')
            if (authHeader?.includes('Bearer')) {
                const introspect = await fetch(issuerURL + ENDPOINT_PATHS.introspect, {
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
            idp_id = jwtPayload.sub
        }

        // search for associated user
        if (idp_id) {
            const {docs, totalDocs} = await payload.find({
                collection: authSlug,
                where: {
                    [fieldsConfig.id.name]: {
                        equals: idp_id
                    }
                }
            })
            if (totalDocs) {
                user = docs[0]
            }
        }

        return {
            user: user ? {
                collection: authSlug,
                ...user
            } : null
        }

    }
})