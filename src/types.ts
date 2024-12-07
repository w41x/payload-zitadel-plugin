import type {NextResponse} from 'next/server.js'
import type {AuthStrategy, Config, SanitizedConfig, ServerProps} from 'payload'
import type {I18nClient, NestedKeysStripped} from '@payloadcms/translations'
import {translations} from './translations.js'

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

export type ZitadelAvatarProps = {
    imageFieldName: string,
}

export type ZitadelLoginButtonProps = ServerProps & {
    i18n: I18nClient<typeof translations.en, NestedKeysStripped<typeof translations.en>>,
    authorizeURL: string,
    label: string
}

export type ZitadelOnSuccess = (state: URLSearchParams) => NextResponse

export type ZitadelCustomConfigSegment = {
    zitadel: {
        issuerURL: string
        clientId: string
        callbackURL: string,
        imageFieldName: string
    }
}

export type PayloadConfigWithZitadel = (Config | SanitizedConfig) & {
    admin: {
        custom: ZitadelCustomConfigSegment
    }
}