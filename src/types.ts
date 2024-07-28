import {AuthStrategy, Config, SanitizedConfig, TypeWithID} from 'payload'
import {NextResponse} from 'next/server.js'

export type ZitadelPluginProps = Partial<{
    disableAvatar: true
    disableDefaultLoginButton: true
    defaultLoginButtonTitle: string
    label: string
    onSuccess: ZitadelOnSuccess
}> & Partial<ZitadelStrategyProps>

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

export type ZitadelUser = TypeWithID & Partial<{
    email: string | null,
    name: string | null,
    image: string | null,
}>

export type ZitadelOnSuccess = (state: URLSearchParams) => NextResponse

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