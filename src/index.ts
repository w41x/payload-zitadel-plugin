import {cookies} from 'next/headers.js'
import {AvatarComponent, LoginButtonComponent} from './components/index.js'
import {COOKIES, DEFAULT_CONFIG, ERRORS, ROUTES} from './constants.js'
import {authorize, callback} from './handlers/index.js'
import {zitadelStrategy} from './strategy.js'
import {translations} from './translations.js'
import {ZitadelAvatarProps, ZitadelPlugin} from './types.js'
import {defaultRedirect, getAuthSlug, requestRedirect} from './utils/index.js'

export const zitadelPlugin: ZitadelPlugin = (config) => {

    let {
        issuerURL = process.env.ZITADEL_URL,
        clientId = process.env.ZITADEL_CLIENT_ID,
        fields,
        strategyName = DEFAULT_CONFIG.strategyName,
        api,
        callbacks,
        components
    } = config ?? {}

    if (!issuerURL) {
        throw ERRORS.issuerURL
    }

    if (!clientId) {
        throw ERRORS.clientId
    }

    if (!api && process.env.ZITADEL_API_CLIENT_ID) {

        const keyId = process.env.ZITADEL_API_KEY_ID
        if (!keyId) {
            throw ERRORS.apiKeyId
        }

        const key = process.env.ZITADEL_API_KEY
        if (!key) {
            throw ERRORS.apiKey
        }

        api = {
            clientId: process.env.ZITADEL_API_CLIENT_ID,
            keyId,
            key
        }

    }

    const fieldsConfig = {...DEFAULT_CONFIG.fields, ...fields}

    return (incomingConfig) => ({
        ...incomingConfig,
        admin: {
            ...incomingConfig.admin,
            ...components?.avatar ? {} : {
                avatar: {
                    Component: {
                        ...AvatarComponent,
                        clientProps: {
                            imageFieldName: fieldsConfig.image.name
                        } satisfies ZitadelAvatarProps
                    }
                }
            },
            ...components?.loginButton ? {} : {
                components: {
                    ...incomingConfig.admin?.components,
                    afterLogin: [
                        ...incomingConfig.admin?.components?.afterLogin ?? [],
                        {
                            ...LoginButtonComponent,
                            serverProps: {
                                label: components?.loginButton?.label ?? DEFAULT_CONFIG.label
                            }
                        }
                    ]
                }
            }
        },
        collections: (incomingConfig.collections || []).map((collection) => {

            const authConfig = typeof collection.auth == 'boolean' ? {} : collection.auth

            return {
                ...collection,
                ...collection.slug == getAuthSlug(incomingConfig) ? {
                    auth: {
                        ...authConfig,
                        disableLocalStrategy: true,
                        strategies: [
                            ...authConfig?.strategies ?? [],
                            zitadelStrategy({
                                strategyName: strategyName,
                                issuerURL,
                                fields: fieldsConfig,
                                api: api ?? false
                            })
                        ]
                    },
                    hooks: {
                        afterLogout: [async () => (await cookies()).set(COOKIES.logout)]
                    },
                    endpoints: [
                        {
                            path: ROUTES.authorize,
                            method: 'get',
                            handler: authorize({
                                issuerURL,
                                clientId
                            })
                        },
                        {
                            path: ROUTES.callback,
                            method: 'get',
                            handler: callback({
                                issuerURL,
                                clientId,
                                fields: fieldsConfig,
                                afterLogin: callbacks?.afterLogin ?? defaultRedirect,
                                afterLogout: callbacks?.afterLogout ?? defaultRedirect
                            })
                        },
                        {
                            path: ROUTES.end_session,
                            method: 'get',
                            handler: (req) => requestRedirect({req, issuerURL, clientId, invokedBy: 'end_session'})
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
    })

}