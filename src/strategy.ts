import {createPrivateKey} from 'crypto'
import {jwtVerify, SignJWT} from 'jose'
import {cookies} from 'next/headers.js'
import {TypeWithID} from 'payload'
import {COOKIES, ENDPOINT_PATHS, ROLES_KEY} from './constants.js'
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

        let idpId: string | undefined
        let introspection
        let user: TypeWithID | null = null

        const cookieStore = await cookies()

        if (api) {
            // in case of API call
            const authHeader = headers.get('Authorization')
            if (authHeader?.includes('Bearer')) {
                const introspect = await fetch(issuerURL + ENDPOINT_PATHS.introspect, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        ...api.type == 'basic' ? {
                            'Authorization': `Basic ${btoa(`${api.clientId}:${api.clientSecret}`)}`
                        } : {}
                    },
                    body: new URLSearchParams({
                        ...api.type == 'jwt' ? {
                            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                            client_assertion: await new SignJWT()
                                .setAudience(issuerURL)
                                .setExpirationTime('1h')
                                .setIssuedAt()
                                .setIssuer(api.jwt.clientId)
                                .setProtectedHeader({
                                    alg: 'RS256',
                                    kid: api.jwt.keyId
                                })
                                .setSubject(api.jwt.clientId)
                                .sign(createPrivateKey(api.jwt.key))
                        } : {},
                        token: authHeader.split(' ')[1]
                    })
                })
                if (introspect.ok) {
                    const data = await introspect.json()
                    if (data?.active) {
                        idpId = data.sub
                        introspection = {
                            [fields.name.name]: data.name,
                            [fields.roles.name]: Object.keys(data[ROLES_KEY] ?? {})
                                .map(key => ({[fields.roleFields.name.name]: key}))
                        }
                    }
                }
            }
        }

        // in case of normal browsing
        if (!idpId && cookieStore.has(COOKIES.idToken.name)) {
            const {payload: jwtPayload} = await jwtVerify<ZitadelIdToken>(cookieStore.get(COOKIES.idToken.name)?.value ?? '', new TextEncoder().encode(payload.secret))
            idpId = jwtPayload.sub
        }

        // search for associated user
        if (idpId) {
            const {docs, totalDocs} = await payload.find({
                collection: authSlug,
                where: {
                    [fields.id.name]: {
                        equals: idpId
                    }
                }
            })
            user = totalDocs ? (introspection ? await payload.update({
                collection: authSlug,
                id: docs[0].id,
                data: introspection
            }) : docs[0]) : (introspection ? await payload.create({
                collection: authSlug,
                data: {
                    [fields.id.name]: idpId,
                    ...introspection
                }
            }) : null)
        }

        return {
            user: user ? {
                collection: authSlug,
                ...user
            } : null
        }

    }
})