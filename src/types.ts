import {AuthStrategy, Config} from 'payload'

export type ZitadelPluginProps = {
    disableAvatar?: true | undefined
    disableDefaultLoginButton?: true | undefined
    defaultLoginButtonTitle?: string
    label?: string
} & Partial<ZitadelStrategyProps>

export type ZitadelPluginType = (props: ZitadelPluginProps) => (config: Config) => Config

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
