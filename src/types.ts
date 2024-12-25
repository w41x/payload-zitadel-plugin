import type {NextResponse} from 'next/server.js'
import type {
    AuthStrategy,
    Config,
    PayloadHandler,
    SanitizedConfig,
    ServerProps
} from 'payload'
import type {I18nClient, NestedKeysStripped} from '@payloadcms/translations'
import {translations} from './translations.js'

export type ZitadelIdToken = Partial<{
    sub: string
    name: string
    email: string
    picture: string
    'urn:zitadel:iam:org:project:roles'?: Record<string, Record<string, string>>
}>

type ZitadelFieldConfig = {
    hidden?: boolean
    name: string
    label: string | Record<string, string>
}

export type ZitadelFieldsConfig = {
    id: ZitadelFieldConfig
    name: ZitadelFieldConfig
    email: ZitadelFieldConfig
    image: ZitadelFieldConfig
    roles: ZitadelFieldConfig & {
        labels: {
            singular: string | Record<string, string>
            plural: string | Record<string, string>
        }
    }
    roleFields: {
        name: ZitadelFieldConfig
    }
}

type ZitadelBaseConfig = {
    issuerURL: string
    authSlug: string
    fieldsConfig: ZitadelFieldsConfig
}

type ZitadelClientConfig = {
    clientId: string
}

export type ZitadelCallbackQuery = {
    code?: string | null
    state?: string | null
}

export type PayloadConfigWithZitadel = (Config | SanitizedConfig) & {
    admin: {
        custom: {
            zitadel: ZitadelBaseConfig & ZitadelClientConfig & {
                authBaseURL: string
            }
        }
    }
}

export type ZitadelStateHandler = (state: URLSearchParams) => NextResponse

export type ZitadelCallbackHandler = (stateHandler: ZitadelStateHandler) => PayloadHandler

type ZitadelAPIConfig = {
    enableAPI: true
    apiClientId: string
    apiKeyId: string
    apiKey: string
}

type ZitadelStrategyConfig = { strategyName: string } & ZitadelBaseConfig & (ZitadelAPIConfig | {
    enableAPI?: undefined
} & Partial<ZitadelAPIConfig>)

export type ZitadelStrategy = (config: ZitadelStrategyConfig) => AuthStrategy

export type ZitadelPlugin = (config: Partial<{
    afterLogin: ZitadelStateHandler
    afterLogout: ZitadelStateHandler
    disableAvatar: true
    disableDefaultLoginButton: true
    label: string
}> & Partial<ZitadelClientConfig> & Partial<ZitadelStrategyConfig>) => (config: Config) => Config

export type ZitadelAvatarProps = {
    imageFieldName: string
}

export type ZitadelLoginButtonProps = ServerProps & {
    authorizeURL: string
    i18n: I18nClient<typeof translations.en, NestedKeysStripped<typeof translations.en>>
    label: string
}

