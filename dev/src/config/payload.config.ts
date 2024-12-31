import path from 'path'
import {fileURLToPath} from 'url'

import {buildConfig} from 'payload'
import {mongooseAdapter} from '@payloadcms/db-mongodb'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import {zitadelPlugin} from 'payload-zitadel-plugin'

import {collections} from '@/collections'
import {UserInfoClientComponent, UserInfoServerComponent} from '@/components'


export default buildConfig({
    collections,
    db: mongooseAdapter({url: 'mongodb://root:secret@db:27017'}),
    editor: lexicalEditor(),
    admin: {
        components: {
            beforeDashboard: [
                UserInfoClientComponent,
                UserInfoServerComponent
            ]
        }
    },
    plugins: [zitadelPlugin()],
    secret: 'top-secret',
    serverURL: 'http://localhost',
    telemetry: false,
    typescript: {
        outputFile: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'payload-types.ts')
    }
})