import {AuthStrategy, Config} from 'payload'

export type OidcPluginProps = {
    disableAvatar?: true | undefined
    disableLocalStrategy?: true | undefined
    disableDefaultLoginButton?: true | undefined
    defaultLoginButtonTitle?: string
    label?: string
} & Partial<OidcStrategyProps>

export type OidcPluginType = (props: OidcPluginProps) => (config: Config) => Config

export type OidcAPIProps = {
    enableAPI: true
    apiClientId: string,
    apiKeyId: string,
    apiKey: string
}

export type OidcStrategyProps = {
    strategyName: string,
    issuerURL: string,
    clientId: string
} & {
    authSlug: string,
    associatedIdFieldName: string,
} & (OidcAPIProps | {
    enableAPI?: undefined
} & Partial<OidcAPIProps>)

export type OidcStrategyType = (props: OidcStrategyProps) => AuthStrategy

export type OidcIdToken = Partial<{
    sub: string,
    name: string,
    email: string,
    picture: string
}>
