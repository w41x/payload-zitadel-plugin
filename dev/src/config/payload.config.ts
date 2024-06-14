import {buildConfig} from 'payload/config'
import path from 'path'
import {fileURLToPath} from 'url'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {de} from '@payloadcms/translations/languages/de'
import {en} from '@payloadcms/translations/languages/en'
import {collections} from '@/collections'
import {ZitadelPluginProvider} from 'payload-zitadel-plugin'
import * as process from 'node:process'

export const {zitadelPlugin, nextauthHandler} = ZitadelPluginProvider({
    externalProviderName: 'Test-IdP',
    disableLocalStrategy: true,
    issuerUrl: process.env.ZITADEL_URL,
    clientId: process.env.ZITADEL_CLIENT_ID,
    enableAPI: true,
    apiClientId: process.env.ZITADEL_API_CLIENT_ID,
    apiKeyId: process.env.ZITADEL_API_KEY_ID,
    apiKey: process.env.ZITADEL_API_KEY
})

export default buildConfig({
    collections,
    db: mongooseAdapter({url: 'mongodb://root:secret@db:27017'}),
    editor: lexicalEditor(),
    i18n: {
        supportedLanguages: {de, en}
    },
    plugins: [
        zitadelPlugin
    ],
    secret: 'top-secret',
    telemetry: false,
    typescript: {
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts')
    }
})