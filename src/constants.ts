import {ResponseCookie} from 'next/dist/compiled/@edge-runtime/cookies/index.js'
import type {ZitadelFieldsConfig} from './types.js'

export const AUTHORIZE_QUERY = {
    response_type: 'code',
    scope: 'openid email profile',
    code_challenge_method: 'S256'
}

export const COMPONENTS_PATH = 'payload-zitadel-plugin/components'

const COOKIE_CONFIG = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV == 'production'
} satisfies Pick<ResponseCookie, 'httpOnly' | 'path' | 'sameSite' | 'secure'>

export const COOKIES = {
    pkce: {
        name: 'zitadel_pkce_code_verifier',
        ...COOKIE_CONFIG
    } satisfies Omit<ResponseCookie, 'value'>,
    idToken: {
        name: 'zitadel_id_token',
        ...COOKIE_CONFIG
    } satisfies Omit<ResponseCookie, 'value'>,
    logout: {
        name: 'zitadel_logout',
        value: 'true',
        ...COOKIE_CONFIG
    } satisfies ResponseCookie
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

export const ENDPOINT_PATHS = {
    authorize: '/oauth/v2/authorize',
    introspect: '/oauth/v2/introspect',
    token: '/oauth/v2/token',
    end_session: '/oidc/v1/end_session'
}

export const ERRORS = {
    issuerURL: new Error('ZITADEL-PLUGIN | Error during initialization of the issuer URL: ' +
        'issuerURL in plugin configuration not provided or empty and ZITADEL_URL environment variable also not found or empty'),
    clientId: new Error('ZITADEL-PLUGIN | Error during initialization of the client Id: ' +
        'clientId in plugin configuration not provided or empty and ZITADEL_CLIENT_ID environment variable also not found or empty'),
    apiKeyId: new Error('ZITADEL-PLUGIN | Error during initialization of the API credentials: ' +
        'API is enabled (api credentials in plugin configuration not provided, but the ZITADEL_API_CLIENT_ID environment variable was found), ' +
        'but ZITADEL_API_KEY_ID environment variable was not found or is empty'),
    apiKey: new Error('ZITADEL-PLUGIN | Error during initialization of the API credentials: ' +
        'API is enabled (api credentials in plugin configuration not provided, but the ZITADEL_API_CLIENT_ID environment variable was found), ' +
        'but ZITADEL_API_KEY environment variable was not found or is empty')
}

export const ROLES_KEY = 'urn:zitadel:iam:org:project:roles'

export const ROUTES = {
    authorize: '/authorize',
    callback: '/callback',
    end_session: '/end_session'
}

