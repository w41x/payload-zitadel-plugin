import {cookies} from 'next/headers.js'
import {NextResponse} from 'next/server.js'
import {COOKIES, DEFAULT_CONFIG, ERROR_MESSAGES, ROUTES} from './constants.js'
import {authorize, callback} from './handlers/index.js'
import {zitadelStrategy} from './strategy.js'
import {translations} from './translations.js'
import {AvatarComponent, LoginButtonComponent} from './components/index.js'
import type {PayloadConfigWithZitadel, ZitadelOnSuccess, ZitadelPluginType} from './types.js'

export const ZitadelPlugin: ZitadelPluginType = ({
                                                     fieldsConfig: _fieldsConfig,
                                                     disableAvatar,
                                                     disableDefaultLoginButton,
                                                     strategyName = DEFAULT_CONFIG.strategyName,
                                                     label = DEFAULT_CONFIG.label,
                                                     issuerURL,
                                                     clientId,
                                                     enableAPI,
                                                     apiClientId,
                                                     apiKeyId,
                                                     apiKey,
                                                     onSuccess
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

    const fieldsConfig = {...DEFAULT_CONFIG.fields, ..._fieldsConfig}

    return (incomingConfig) => {

        const serverURL = incomingConfig.serverURL ?? 'http://localhost'

        const authSlug = incomingConfig.admin?.user ?? 'users'

        const authBaseURL = `${serverURL}/api/${authSlug}`
        const authorizeURL = authBaseURL + ROUTES.authorize
        const callbackURL = authBaseURL + ROUTES.callback

        const defaultOnSuccess: ZitadelOnSuccess = (state) =>
            NextResponse.redirect(serverURL + (state.get('redirect') ?? ''))

        return {
            ...incomingConfig,
            admin: {
                ...incomingConfig.admin,
                ...disableAvatar ? {} : {
                    avatar: {
                        Component: {
                            ...AvatarComponent,
                            clientProps: {
                                imageFieldName: fieldsConfig.image.name
                            }
                        }
                    }
                },
                ...disableDefaultLoginButton ? {} : {
                    components: {
                        ...incomingConfig.admin?.components,
                        afterLogin: [
                            ...incomingConfig.admin?.components?.afterLogin ?? [],
                            {
                                ...LoginButtonComponent,
                                serverProps: {
                                    authorizeURL,
                                    label
                                }
                            }
                        ]
                    }
                },
                custom: {
                    ...incomingConfig.admin?.custom,
                    zitadel: {
                        issuerURL,
                        clientId,
                        callbackURL,
                        imageFieldName: fieldsConfig.image.name
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
                                    fieldsConfig,
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
                            afterLogout: [async () => (await cookies()).delete(COOKIES.idToken)]
                        },
                        endpoints: [
                            {
                                path: ROUTES.authorize,
                                method: 'get',
                                handler: authorize
                            },
                            {
                                path: ROUTES.callback,
                                method: 'get',
                                handler: callback(onSuccess ?? defaultOnSuccess)
                            }
                        ],
                        fields: [
                            ...collection.fields,
                            {
                                ...fieldsConfig.id,
                                type: 'text',
                                admin: {
                                    readOnly: true
                                },
                                index: true,
                                unique: true,
                                required: true
                            },
                            {
                                ...fieldsConfig.name,
                                type: 'text',
                                admin: {
                                    readOnly: true
                                }
                            },
                            {
                                ...fieldsConfig.email,
                                type: 'email',
                                admin: {
                                    readOnly: true
                                }
                            },
                            {
                                ...fieldsConfig.image,
                                type: 'text',
                                admin: {
                                    readOnly: true
                                }
                            },
                            {
                                ...fieldsConfig.roles,
                                type: 'array',
                                admin: {
                                    readOnly: true
                                },
                                fields: [
                                    {
                                        ...fieldsConfig.roleFields.name,
                                        type: 'text'
                                    }
                                ]
                            }
                        ]
                    } : {}
                }
            }),
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
        } satisfies PayloadConfigWithZitadel

    }

}