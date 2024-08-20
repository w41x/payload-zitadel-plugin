import {buildConfig} from 'payload'
import path from 'path'
import {fileURLToPath} from 'url'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {de} from '@payloadcms/translations/languages/de'
import {en} from '@payloadcms/translations/languages/en'
import {collections} from '@/collections'
import {ZitadelPlugin} from 'payload-zitadel-plugin'


export default buildConfig({
    collections,
    db: mongooseAdapter({url: 'mongodb://root:secret@db:27017'}),
    editor: lexicalEditor(),
    i18n: {
        supportedLanguages: {de, en}
    },
    admin: {
        components: {
            beforeDashboard: [
                '/src/components#UserInfoCSR',
                '/src/components#UserInfoSSR'
            ]
        }
    },
    localization: {
        locales: ['de', 'en'],
        defaultLocale: 'en',
        fallback: true
    },
    plugins: [
        ZitadelPlugin({
            label: 'Test-IdP',
            issuerURL: process.env.ZITADEL_URL,
            clientId: process.env.ZITADEL_CLIENT_ID,
            enableAPI: true,
            apiClientId: process.env.ZITADEL_API_CLIENT_ID,
            apiKeyId: process.env.ZITADEL_API_KEY_ID,
            apiKey: process.env.ZITADEL_API_KEY
        })
    ],
    secret: 'top-secret',
    serverURL: 'http://localhost',
    telemetry: false,
    typescript: {
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts')
    }
})