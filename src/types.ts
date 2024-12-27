import type {AuthStrategy, Config, PayloadHandler, PayloadRequest, ServerProps} from 'payload'
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
    clientId: string
}

type ZitadelUserConfig = {
    fields: ZitadelFieldsConfig
}

export type ZitadelCallbackQuery = Partial<{
    code: string | null,
    state: string | null,
}>

type ZitadelInvoker = 'authorize' | 'end_session'

type ZitadelInvokedBy<InvokedBy extends ZitadelInvoker = ZitadelInvoker> = {
    invokedBy: InvokedBy
}

export type ZitadelCallbackState = Record<any, any> & ZitadelInvokedBy

export type ZitadelCallbackConfig = {
    afterLogin: PayloadHandler
    afterLogout: PayloadHandler
}

export type ZitadelBaseHandler<ConfigExtension = {}> = (config: ZitadelBaseConfig & ConfigExtension) => PayloadHandler

export type ZitadelCallbackHandler = ZitadelBaseHandler<ZitadelUserConfig & ZitadelCallbackConfig>

type ZitadelAPIConfig = {
    clientId: string
    key: string
    keyId: string
}

type ZitadelStrategyConfig = {
    strategyName: string
    api: ZitadelAPIConfig | false
}

export type ZitadelStrategy = (config: Omit<ZitadelBaseConfig, 'clientId'> & ZitadelUserConfig & ZitadelStrategyConfig) => AuthStrategy

type ZitadelAvatarConfig = {
    disable: true
}

export type ZitadelAvatarProps = {
    imageFieldName: string
}

type ZitadelLoginButtonConfig = {
    disable: true
    label: string
}

export type ZitadelLoginButtonProps = ServerProps & Omit<ZitadelLoginButtonConfig, 'disable'> & {
    i18n: I18nClient<typeof translations.en, NestedKeysStripped<typeof translations.en>>
}

type ZitadelComponentsConfig = {
    avatar: ZitadelAvatarConfig
    loginButton: ZitadelLoginButtonConfig
}

type ZitadelPluginConfig =
    ZitadelBaseConfig
    & Partial<ZitadelUserConfig>
    & Partial<ZitadelStrategyConfig>
    & Partial<{
    callbacks: Partial<ZitadelCallbackConfig>
    components: Partial<ZitadelComponentsConfig>
}>

export type ZitadelPlugin = (config: ZitadelPluginConfig) => (config: Config) => Config

type ZitadelAuthorizeRequestConfig = {
    codeChallenge: string
}


type ZitadelRequestState =
    (ZitadelInvokedBy<'authorize'> & ZitadelAuthorizeRequestConfig)
    | (ZitadelInvokedBy<'end_session'> & Partial<ZitadelAuthorizeRequestConfig>)

type ZitadelRequestConfig = {
    req: PayloadRequest
} & ZitadelBaseConfig & ZitadelRequestState

export type ZitadelRequestHandler = (config: ZitadelRequestConfig) => Response


