import type {ZitadelFieldsConfig} from './types.js'

export const COMPONENTS_PATH = 'payload-zitadel-plugin/components'

export const COOKIES = {
    pkce: 'zitadel_pkce_code_verifier',
    idToken: 'zitadel_id_token',
    state: 'zitadel_state'
}

export const DEFAULT_CONFIG = {
    fields: {
        id: {
            name: 'idp_id',
            label: {
                de: 'Identifikation im System des Identitätsanbieters',
                en: 'Identifier in the system of the Identity Provider'
            }
        },
        name: {
            name: 'name',
            label: {de: 'Name', en: 'Name'}
        },
        email: {
            name: 'email',
            label: {de: 'E-Mail', en: 'Email'}
        },
        image: {
            name: 'image',
            label: {de: 'Profilbild-URL', en: 'Profile picture URL'}
        },
        roles: {
            name: 'roles',
            label: {de: 'Rollen', en: 'Roles'},
            labels: {
                singular: {de: 'Rolle', en: 'Role'},
                plural: {de: 'Rollen', en: 'Roles'}
            }
        },
        roleFields: {
            name: {
                name: 'name',
                label: {de: 'Name', en: 'Name'}
            }
        }
    } satisfies ZitadelFieldsConfig,
    strategyName: 'zitadel',
    label: 'Zitadel'
}

export const ERROR_MESSAGES = {
    issuerURL: 'ZITADEL-PLUGIN: ISSUER-URL IS EMPTY',
    clientId: 'ZITADEL-PLUGIN: CLIENT-ID IS EMPTY',
    apiClientId: 'ZITADEL-PLUGIN: API ENABLED, BUT API-CLIENT-ID IS EMPTY',
    apiKeyId: 'ZITADEL-PLUGIN: API ENABLED, BUT API-KEY-ID IS EMPTY',
    apiKey: 'ZITADEL-PLUGIN: API ENABLED, BUT API-KEY IS EMPTY'
}
export const ROUTES = {
    authorize: '/authorize',
    callback: '/callback',
    redirect: '/redirect'
}

