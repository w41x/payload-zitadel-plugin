import {cookies} from 'next/headers.js'
import {Avatar, LoginButton} from './components/index.js'
import {COOKIE_ID_TOKEN, DEFAULT_CONFIG, DELETE_ME_USER, ERROR_MESSAGES} from './constants.js'
import {authorize, callback} from './handlers/index.js'
import {zitadelStrategy} from './strategy.js'
import {ZitadelPluginType} from './types.js'
import {translations} from './translations.js'
export {getCurrentUser} from './utils/index.js'

export const ZitadelPlugin: ZitadelPluginType = ({
                                                     associatedIdFieldName = DEFAULT_CONFIG.associatedIdFieldName,
                                                     disableAvatar,
                                                     disableDefaultLoginButton,
                                                     strategyName = DEFAULT_CONFIG.strategyName,
                                                     label = DEFAULT_CONFIG.label,
                                                     issuerURL,
                                                     clientId,
                                                     enableAPI,
                                                     apiClientId,
                                                     apiKeyId,
                                                     apiKey
                                                 }) => {
    if (!issuerURL)
        throw new Error(ERROR_MESSAGES.issuerURL)
    if (!clientId)
        throw new Error(ERROR_MESSAGES.clientId)
    if (enableAPI) {
        if (!apiClientId)
            throw new Error(ERROR_MESSAGES.apiClientId)
        if (!apiKeyId)
            throw new Error(ERROR_MESSAGES.apiKey)
        if (!apiKey)
            throw new Error(ERROR_MESSAGES.apiKey)
    }

    return (incomingConfig) => {

        const authSlug = incomingConfig.admin?.user ?? 'users'

        return {
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
            collections: (incomingConfig.collections || []).map((collection) => {

                const authConfig = typeof collection.auth == 'boolean' ? {} : collection.auth

                return {
                    ...collection,
                    ...collection.slug == authSlug ? {
                        auth: {
                            ...authConfig,
                            disableLocalStrategy: true,
                            strategies: [
                                ...authConfig?.strategies ?? [],
                                zitadelStrategy({
                                    authSlug,
                                    associatedIdFieldName,
                                    strategyName: strategyName,
                                    issuerURL: issuerURL as string,
                                    clientId: clientId as string,
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

                            afterLogout: [() => cookies().delete(COOKIE_ID_TOKEN)],

                            // current work around (see onInit)
                            afterChange: [async ({req}) => {
                                const response = await req.payload.find({collection: authSlug})
                                // to minimize unnecessary checks after the first two real users
                                if (response.totalDocs == 2) {
                                    await req.payload.delete({
                                        collection: authSlug,
                                        where: {
                                            [associatedIdFieldName]: {
                                                equals: DELETE_ME_USER.associatedId
                                            }
                                        }
                                    })
                                }
                            }]

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
                }
            }),

            // current work around on creating a non-functional first user, which will be deleted after first login
            async onInit(payload) {
                if (incomingConfig.onInit)
                    await incomingConfig.onInit(payload)

                const existingUsers = await payload.find({
                    collection: authSlug,
                    limit: 1
                })

                if (existingUsers.docs.length === 0) {
                    await payload.create({
                        collection: authSlug,
                        data: {
                            email: DELETE_ME_USER.email,
                            password: DELETE_ME_USER.password,
                            [associatedIdFieldName]: DELETE_ME_USER.associatedId
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
        }
    }

}