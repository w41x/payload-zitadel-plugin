import NextAuth from 'next-auth'
import {authOptions} from './options.js'
import {zitadelStrategy} from './strategy.js'
import {ZitadelAuthOptionsProps, ZitadelPluginProviderType} from './types.js'
import {translations} from './translations.js'
import {Avatar, LoginButton} from './components/index.js'

export const ZitadelPluginProvider: ZitadelPluginProviderType = ({
                                                                     authSlug = 'users',
                                                                     associatedIdFieldName = 'idp_id',
                                                                     disableAvatar,
                                                                     disableLocalStrategy,
                                                                     disableDefaultLoginButton,
                                                                     internalProviderName = 'zitadel',
                                                                     externalProviderName = 'ZITADEL',
                                                                     issuerUrl,
                                                                     clientId,
                                                                     enableAPI,
                                                                     apiClientId,
                                                                     apiKeyId,
                                                                     apiKey
                                                                 }) => {
    if ((issuerUrl ?? '').length == 0)
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
    const authOptionsProps: ZitadelAuthOptionsProps = {
        internalProviderName: internalProviderName,
        issuerUrl: issuerUrl!,
        clientId: clientId!
    }
    const nextAuth = NextAuth(authOptions(authOptionsProps))
    const {auth, signIn, signOut} = nextAuth
    return {
        zitadelPlugin: (incomingConfig) => ({
            ...incomingConfig,
            admin: {
                ...incomingConfig.admin,
                ...(disableAvatar ? {} : {avatar: Avatar({auth})}),
                components: {
                    ...incomingConfig.admin?.components,
                    afterLogin: [
                        ...incomingConfig.admin?.components?.afterLogin || [],
                        ...(disableDefaultLoginButton ? [] : [LoginButton({
                            signIn,
                            externalProviderName
                        })])
                    ]
                }
            },
            collections: (incomingConfig.collections || []).map((collection) => ({
                ...collection,
                ...collection.slug == authSlug ? {
                    auth: {
                        ...(typeof collection.auth == 'boolean' ? {} : collection.auth),
                        disableLocalStrategy: disableLocalStrategy ? disableLocalStrategy : (typeof collection.auth == 'boolean' ? {} : collection.auth)?.disableLocalStrategy,
                        strategies: [
                            ...(typeof collection.auth == 'boolean' ? {} : collection.auth)?.strategies ?? [],
                            zitadelStrategy({
                                auth,
                                authSlug,
                                associatedIdFieldName,
                                ...authOptionsProps,
                                ...(enableAPI ? {
                                    enableAPI: true,
                                    apiClientId: apiClientId!,
                                    apiKeyId: apiClientId!,
                                    apiKey: apiKey!
                                } : {enableAPI: undefined})
                            })
                        ]
                    },
                    fields: [
                        ...collection.fields,
                        {
                            name: associatedIdFieldName,
                            type: 'text',
                            unique: true,
                            required: true
                        },
                        {
                            name: 'email',
                            type: 'email',
                            admin: {
                                readOnly: true
                            },
                            access: {},
                            hooks: {
                                afterRead: [
                                    async () => (await auth())?.user?.email
                                ]
                            }
                        },
                        {
                            name: 'name',
                            type: 'text',
                            admin: {
                                readOnly: true
                            },
                            access: {},
                            hooks: {
                                afterRead: [
                                    async () => (await auth())?.user?.name
                                ]
                            }
                        }
                    ],
                    hooks: {
                        afterLogout: [
                            () => signOut()
                        ]
                    }
                } : {}
            })),
            endpoints: [
                {
                    path: 'xyz',
                    method: 'get',
                    handler: (req) => Response.json({xyz: ''})
                }
            ],

            //current work around on creating a non-functional first user
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
        }),
        ...nextAuth
    }
}