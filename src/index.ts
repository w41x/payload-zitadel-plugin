import {NextResponse} from 'next/server.js'
import {DEFAULT_CONFIG, ERROR_MESSAGES, ROUTES} from './constants.js'
import {authorize, callback, loggedOut} from './handlers/index.js'
import {logout} from './hooks/index.js'
import {zitadelStrategy} from './strategy.js'
import {translations} from './translations.js'
import {AvatarComponent, LoginButtonComponent} from './components/index.js'
import {
    ZitadelAvatarProps,
    PayloadConfigWithZitadel,
    ZitadelLoginButtonProps,
    ZitadelPlugin,
    ZitadelStateHandler
} from './types.js'

export const zitadelPlugin: ZitadelPlugin = ({
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
                                                 afterLogin,
                                                 afterLogout
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

        const defaultStateHandler: ZitadelStateHandler = (state) =>
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
                            } satisfies ZitadelAvatarProps
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
                                    authorizeURL: authBaseURL + ROUTES.authorize,
                                    label
                                } satisfies Pick<ZitadelLoginButtonProps, 'authorizeURL' | 'label'>
                            }
                        ]
                    }
                },
                custom: {
                    ...incomingConfig.admin?.custom,
                    zitadel: {
                        issuerURL,
                        clientId,
                        authSlug,
                        authBaseURL,
                        fieldsConfig
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
                            afterLogout: [logout]
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
                                handler: callback(afterLogin ?? defaultStateHandler)
                            },
                            {
                                path: ROUTES.logged_out,
                                method: 'get',
                                handler: loggedOut(afterLogout ?? defaultStateHandler)
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