import {AuthStrategy, Config, PayloadHandler, SanitizedConfig} from 'payload'

export type ZitadelPluginProps = Partial<{
    disableAvatar: true
    disableDefaultLoginButton: true
    defaultLoginButtonTitle: string
    label: string
    onSuccess: ZitadelOnSuccess
}> & Partial<ZitadelStrategyProps>

export type ZitadelPluginType = (props: ZitadelPluginProps) => (config: Config) => PayloadConfigWithZitadel

export type ZitadelAPIProps = {
    enableAPI: true
    apiClientId: string,
    apiKeyId: string,
    apiKey: string
}

export type ZitadelStrategyProps = {
    strategyName: string,
    issuerURL: string,
    clientId: string
} & {
    authSlug: string,
    associatedIdFieldName: string,
} & (ZitadelAPIProps | {
    enableAPI?: undefined
} & Partial<ZitadelAPIProps>)

export type ZitadelStrategyType = (props: ZitadelStrategyProps) => AuthStrategy

export type ZitadelIdToken = Partial<{
    sub: string,
    name: string,
    email: string,
    picture: string
}>

export type ZitadelOnSuccess = (state: URLSearchParams) => ReturnType<PayloadHandler>

export type PayloadConfigWithZitadel = (Config | SanitizedConfig) & {
    admin: {
        custom: {
            zitadel: {
                issuerURL: string
                clientId: string
                label: string
                authorizeURL: string
                callbackURL: string
            }
        }
    }
}