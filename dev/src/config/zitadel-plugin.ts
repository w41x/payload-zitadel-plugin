import {ZitadelPluginProvider} from 'payload-zitadel-plugin'

export const {zitadelPlugin, withZitadel, nextauthHandler} = ZitadelPluginProvider({
    externalProviderName: 'Test-IdP',
    disableLocalStrategy: true,
    issuerUrl: process.env.ZITADEL_URL,
    clientId: process.env.ZITADEL_CLIENT_ID,
    enableAPI: true,
    apiClientId: process.env.ZITADEL_API_CLIENT_ID,
    apiKeyId: process.env.ZITADEL_API_KEY_ID,
    apiKey: process.env.ZITADEL_API_KEY
})