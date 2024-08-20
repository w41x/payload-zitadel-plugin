import {AuthStrategy, ClientConfig, Config, SanitizedConfig, ServerProps, TypedUser, TypeWithID} from 'payload'
import {NextResponse} from 'next/server.js'
import {ClientConfigContext} from '@payloadcms/ui/providers/Config'
import {translations} from './translations.js'
import {I18nClient, NestedKeysStripped} from '@payloadcms/translations'

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

export type ZitadelUser = TypedUser & Partial<{
    email: string | null,
    name: string | null,
    image: string | null,
}>

export type ZitadelAvatarProps = ServerProps & { user: ZitadelUser }

export type ZitadelLoginButtonProps = ServerProps & {
    i18n: I18nClient<typeof translations.en, NestedKeysStripped<typeof translations.en>>,
    authorizeURL: string,
    label: string
}

export type ZitadelOnSuccess = (state: URLSearchParams) => NextResponse

export type PayloadConfigWithZitadel = (Config | SanitizedConfig) & {
    admin: {
        custom: {
            zitadel: {
                issuerURL: string
                clientId: string
                callbackURL: string
            }
        }
    }
}

export type PayloadConfigWithZitadelContext = ClientConfigContext & {
    config: PayloadConfigWithZitadel
}