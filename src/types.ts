import {NextAuthOptions} from 'next-auth'
import {AuthStrategy} from 'payload'
import {Config} from 'payload'
import {NextConfig} from 'next'

export type ZitadelPluginProps = {
    disableAvatar?: true | undefined
    disableLocalStrategy?: true | undefined
    disableDefaultLoginButton?: true | undefined
    defaultLoginButtonTitle?: string
    externalProviderName?: string
} & Partial<ZitadelStrategyProps>

export type ZitadelPluginProviderType = (props: ZitadelPluginProps) => {
    zitadelPlugin: (incomingConfig: Config) => Config,
    withZitadel: (nextConfig?: NextConfig) => NextConfig,
    nextauthHandler: any
}

export type ZitadelAuthOptionsProps = {
    internalProviderName: string,
    issuerUrl: string,
    clientId: string
}

export type ZitadelAuthOptionsType = (props: ZitadelAuthOptionsProps) => NextAuthOptions

export type ZitadelAPIProps = {
    enableAPI: true
    apiClientId: string,
    apiKeyId: string,
    apiKey: string
}

export type ZitadelStrategyProps = ZitadelAuthOptionsProps & {
    authSlug: string,
    associatedIdFieldName: string,
} & (ZitadelAPIProps | {
    enableAPI?: undefined
} & Partial<ZitadelAPIProps>)

export type ZitadelStrategyType = (props: ZitadelStrategyProps) => AuthStrategy