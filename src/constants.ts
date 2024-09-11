export const COOKIES = {
    pkce: 'zitadel_pkce_code_verifier',
    idToken: 'zitadel_id_token',
    state: 'zitadel_state'
}

export const DEFAULT_CONFIG = {
    associatedIdFieldName: 'idp_id',
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

