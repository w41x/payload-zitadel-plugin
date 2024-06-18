import {buildConfig} from 'payload'
import path from 'path'
import {fileURLToPath} from 'url'

import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'

import {de} from '@payloadcms/translations/languages/de'
import {en} from '@payloadcms/translations/languages/en'
import {collections} from '@/collections'
import {zitadelPlugin} from '@/config/zitadel-plugin'


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