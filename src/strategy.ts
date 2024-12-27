import {jwtVerify, SignJWT} from 'jose'
import {cookies} from 'next/headers.js'
import {TypeWithID} from 'payload'
import {COOKIES, ENDPOINT_PATHS} from './constants.js'
import type {ZitadelIdToken, ZitadelStrategy} from './types.js'
import {getAuthSlug} from './utils/index.js'

export const zitadelStrategy: ZitadelStrategy = ({
                                                     strategyName,
                                                     issuerURL,
                                                     fields,
                                                     api
                                                 }) => ({
    name: strategyName,
    authenticate: async ({headers, payload}) => {

        const authSlug = getAuthSlug(payload.config)

        let idp_id
        let user: TypeWithID | null = null

        const cookieStore = await cookies()

        if (api) {
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
                            .setProtectedHeader({alg: 'RS256', kid: api.keyId})
                            .setIssuer(api.clientId)
                            .setAudience(issuerURL)
                            .setSubject(api.clientId)
                            .setIssuedAt()
                            .setExpirationTime('1h')
                            .sign(new TextEncoder().encode(api.key)),
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
        if (!idp_id && cookieStore.has(COOKIES.idToken.name)) {
            const {payload: jwtPayload} = await jwtVerify<ZitadelIdToken>(cookieStore.get(COOKIES.idToken.name)?.value ?? '', new TextEncoder().encode(payload.secret))
            idp_id = jwtPayload.sub
        }

        // search for associated user
        if (idp_id) {
            const {docs, totalDocs} = await payload.find({
                collection: authSlug,
                where: {
                    [fields.id.name]: {
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