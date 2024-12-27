import process from 'node:process'
import {ResponseCookie} from 'next/dist/compiled/@edge-runtime/cookies/index.js'
import type {ZitadelFieldsConfig} from './types.js'

export const AUTHORIZE_QUERY = {
    response_type: 'code',
    scope: 'openid email profile',
    code_challenge_method: 'S256'
}

export const COMPONENTS_PATH = 'payload-zitadel-plugin/components'

export const COOKIE_CONFIG = {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV == 'production'
} satisfies Pick<ResponseCookie, 'httpOnly' | 'path' | 'sameSite' | 'secure'>

export const COOKIES = {
    pkce: 'zitadel_pkce_code_verifier',
    idToken: 'zitadel_id_token',
    logout: 'zitadel_logout'
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

export const ROLES_KEY = 'urn:zitadel:iam:org:project:roles'

export const ROUTES = {
    authorize: '/authorize',
    callback: '/callback',
    end_session: '/end_session'
}

