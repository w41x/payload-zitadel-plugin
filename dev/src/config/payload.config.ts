import path from 'path'
import {fileURLToPath} from 'url'

import {buildConfig} from 'payload'
import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {de} from '@payloadcms/translations/languages/de'
import {en} from '@payloadcms/translations/languages/en'
import {zitadelPlugin} from 'payload-zitadel-plugin'

import {collections} from '@/collections'
import {UserInfoClientComponent, UserInfoServerComponent} from '@/components'


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
                UserInfoClientComponent,
                UserInfoServerComponent
            ]
        }
    },
    localization: {
        locales: ['de', 'en'],
        defaultLocale: 'en',
        fallback: true
    },
    plugins: [
        zitadelPlugin({
            issuerURL: process.env.ZITADEL_URL ?? '',
            clientId: process.env.ZITADEL_CLIENT_ID ?? ''
        })
    ],
    secret: 'top-secret',
    serverURL: 'http://localhost',
    telemetry: false,
    typescript: {
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts')
    }
})