import {AuthStrategy, Config, SanitizedConfig, ServerProps, TypedUser} from 'payload'
import {NextResponse} from 'next/server.js'
import {translations} from './translations.js'
import {I18nClient, NestedKeysStripped} from '@payloadcms/translations'

export type ZitadelFieldConfig = {
    hidden?: boolean,
    name: string,
    label: string | Record<string, string>,
}

export type ZitadelFieldsConfig = {
    id: ZitadelFieldConfig,
    name: ZitadelFieldConfig
    email: ZitadelFieldConfig,
    image: ZitadelFieldConfig,
    roles: ZitadelFieldConfig & {
        labels: {
            singular: string | Record<string, string>,
            plural: string | Record<string, string>
        }
    }
    roleFields: {
        name: ZitadelFieldConfig
    }
}

export type ZitadelPluginProps = Partial<{
    fieldsConfig: Partial<ZitadelFieldsConfig>,
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
    authSlug: string
} & (ZitadelAPIProps | {
    enableAPI?: undefined
} & Partial<ZitadelAPIProps>)

export type ZitadelStrategyType = (props: ZitadelStrategyProps & {
    fieldsConfig: ZitadelFieldsConfig
}) => AuthStrategy

export type ZitadelIdToken = Partial<{
    sub: string,
    name: string,
    email: string,
    picture: string,
    'urn:zitadel:iam:org:project:roles'?: Record<string, Record<string, string>>
}>

export type ZitadelUser = TypedUser & Partial<{
    email: string | null,
    name: string | null,
    image: string | null,
}>

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