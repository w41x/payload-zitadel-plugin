import {NextAuthOptions} from 'next-auth'
import {AuthStrategy} from 'payload/auth'
import {Config} from 'payload/config'

export type ZitadelPluginProps = {
    disableLocalStrategy?: true | undefined
    disableDefaultLoginButton?: true | undefined
    defaultLoginButtonTitle?: string
    externalProviderName?: string
} & Partial<ZitadelStrategyProps>

export type ZitadelPluginProviderType = (props: ZitadelPluginProps) => {
    zitadelPlugin: (incomingConfig: Config) => Config,
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