import {NextAuthConfig, NextAuthResult, Session} from 'next-auth'
import {AuthStrategy} from 'payload'
import {Config} from 'payload'
import {JWT} from 'next-auth/jwt'

export type ZitadelPluginProps = {
    disableAvatar?: true | undefined
    disableLocalStrategy?: true | undefined
    disableDefaultLoginButton?: true | undefined
    defaultLoginButtonTitle?: string
    externalProviderName?: string
} & Partial<ZitadelStrategyProps>

export type ZitadelPluginProviderType = (props: ZitadelPluginProps) => {
    zitadelPlugin: (incomingConfig: Config) => Config
} & NextAuthResult

export type ZitadelAuthOptionsProps = {
    internalProviderName: string,
    issuerUrl: string,
    clientId: string
}

export type ZitadelAuthOptionsType = (props: ZitadelAuthOptionsProps) => NextAuthConfig & {
    callbacks: { session: (props: { session: Session, token: JWT & { user: any } }) => Promise<Session> }
}

export type ZitadelAPIProps = {
    enableAPI: true
    apiClientId: string,
    apiKeyId: string,
    apiKey: string
}

export type ZitadelStrategyProps = ZitadelAuthOptionsProps & {
    auth: NextAuthResult['auth']
    authSlug: string,
    associatedIdFieldName: string,
} & (ZitadelAPIProps | {
    enableAPI?: undefined
} & Partial<ZitadelAPIProps>)

export type ZitadelStrategyType = (props: ZitadelStrategyProps) => AuthStrategy