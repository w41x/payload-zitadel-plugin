export const ROUTES = {
    authorize: '/authorize',
    callback: '/callback'
}

export const COOKIE_ID_TOKEN = 'id_token'

export const DEFAULT_CONFIG = {
    associatedIdFieldName: 'idp_id',
    strategyName: 'zitadel',
    label: 'Zitadel'
}

export const DELETE_ME_USER = {
    email: 'delete.me@now.not-tld',
    password: 'password',
    associatedId: 'DELETE_ME'
}

export const ERROR_MESSAGES = {
    issuerURL: 'ZITADEL-PLUGIN: ISSUER-URL IS EMPTY',
    clientId: 'ZITADEL-PLUGIN: CLIENT-ID IS EMPTY',
    apiClientId: 'ZITADEL-PLUGIN: API ENABLED, BUT API-CLIENT-ID IS EMPTY',
    apiKeyId: 'ZITADEL-PLUGIN: API ENABLED, BUT API-KEY-ID IS EMPTY',
    apiKey: 'ZITADEL-PLUGIN: API ENABLED, BUT API-KEY IS EMPTY'
}