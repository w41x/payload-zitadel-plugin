import {zitadelStrategy} from './strategy.js'
import {ZitadelPluginType} from './types.js'
import {translations} from './translations.js'
import {Avatar, LoginButton} from './components/index.js'
import {authorize, callback} from './handlers/index.js'
import {cookies} from 'next/headers.js'

export {getCurrentUser} from './utils/index.js'

export const ZitadelPlugin: ZitadelPluginType = ({
                                                     associatedIdFieldName = 'idp_id',
                                                     disableAvatar,
                                                     disableLocalStrategy,
                                                     disableDefaultLoginButton,
                                                     strategyName = 'idp',
                                                     label = 'IdP',
                                                     issuerURL,
                                                     clientId,
                                                     enableAPI,
                                                     apiClientId,
                                                     apiKeyId,
                                                     apiKey
                                                 }) => {
    if ((issuerURL ?? '').length == 0)
        throw new Error('ZITADEL-PLUGIN: ISSUER-URL IS EMPTY')
    if ((clientId ?? '').length == 0)
        throw new Error('ZITADEL-PLUGIN: CLIENT-ID IS EMPTY')
    if (enableAPI) {
        if ((apiClientId ?? '').length == 0)
            throw new Error('ZITADEL-PLUGIN: API ENABLED, BUT API-CLIENT-ID IS EMPTY')
        if ((apiKeyId ?? '').length == 0)
            throw new Error('ZITADEL-PLUGIN: API ENABLED, BUT API-KEY-ID IS EMPTY')
        if ((apiKey ?? '').length == 0)
            throw new Error('ZITADEL-PLUGIN: API ENABLED, BUT API-KEY IS EMPTY')
    }

    return (incomingConfig) => ({
        ...incomingConfig,
        admin: {
            ...incomingConfig.admin,
            ...(disableAvatar ? {} : {avatar: Avatar}),
            components: {
                ...incomingConfig.admin?.components,
                afterLogin: [
                    ...incomingConfig.admin?.components?.afterLogin || [],
                    ...(disableDefaultLoginButton ? [] : [LoginButton])
                ]
            },
            custom: {
                zitadel: {
                    issuerURL,
                    clientId,
                    redirectURL: `${incomingConfig.serverURL ?? 'http://localhost'}/api/${incomingConfig.admin?.user ?? 'users'}/callback`,
                    label
                }
            }
        },
        collections: (incomingConfig.collections || []).map((collection) => ({
            ...collection,
            ...collection.slug == (incomingConfig.admin?.user ?? 'users') ? {
                auth: {
                    ...(typeof collection.auth == 'boolean' ? {} : collection.auth),
                    disableLocalStrategy: disableLocalStrategy ? disableLocalStrategy : (typeof collection.auth == 'boolean' ? {} : collection.auth)?.disableLocalStrategy,
                    strategies: [
                        ...(typeof collection.auth == 'boolean' ? {} : collection.auth)?.strategies ?? [],
                        zitadelStrategy({
                            authSlug: incomingConfig.admin?.user ?? 'users',
                            associatedIdFieldName,
                            strategyName: strategyName,
                            issuerURL: issuerURL ?? '',
                            clientId: clientId ?? '',
                            ...(enableAPI ? {
                                enableAPI: true,
                                apiClientId: apiClientId!,
                                apiKeyId: apiClientId!,
                                apiKey: apiKey!
                            } : {enableAPI: undefined})
                        })
                    ]
                },
                hooks: {
                    afterLogout: [() => cookies().delete('id_token')]
                },
                endpoints: [
                    {
                        path: '/authorize',
                        method: 'get',
                        handler: authorize
                    },
                    {
                        path: '/callback',
                        method: 'get',
                        handler: callback
                    }
                ],
                fields: [
                    ...collection.fields,
                    {
                        name: associatedIdFieldName,
                        type: 'text',
                        admin: {
                            readOnly: true
                        },
                        unique: true,
                        required: true
                    },
                    {
                        name: 'email',
                        type: 'email',
                        admin: {
                            readOnly: true
                        }
                    },
                    {
                        name: 'name',
                        type: 'text',
                        admin: {
                            readOnly: true
                        }
                    },
                    {
                        name: 'image',
                        type: 'text',
                        admin: {
                            readOnly: true
                        }
                    }
                ]
            } : {}
        })),

        //current work around on creating a non-functional first user
        async onInit(payload) {
            if (incomingConfig.onInit)
                await incomingConfig.onInit(payload)

            const existingUsers = await payload.find({
                collection: incomingConfig.admin?.user ?? 'users',
                limit: 1
            })

            if (existingUsers.docs.length === 0) {
                await payload.create({
                    collection: incomingConfig.admin?.user ?? 'users',
                    data: {
                        email: 'delete.me@now.com',
                        password: 'password',
                        [associatedIdFieldName]: 'DELETE_ME'
                    }
                })
            }
        },

        i18n: {
            ...incomingConfig.i18n,
            translations: {
                ...incomingConfig.i18n?.translations,
                de: {
                    ...incomingConfig.i18n?.translations?.de,
                    ...translations.de
                },
                en: {
                    ...incomingConfig.i18n?.translations?.en,
                    ...translations.en
                }
            }
        }
    })
}