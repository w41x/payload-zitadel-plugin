import {withPayload} from '@payloadcms/next/withPayload'
import process from 'node:process'

export default withPayload({
        images: {
            remotePatterns: [
                {
                    //protocol: new URL(process.env.ZITADEL_URL).protocol,
                    hostname: new URL(process.env.ZITADEL_URL ?? '').hostname,
                    //port: new URL(process.env.ZITADEL_URL).port,
                    pathname: '/assets/**'
                }
            ]
        },

        // optional: enable auto-redirect to Zitadel login page if not logged in
        // deno-lint-ignore require-await
        async redirects() {
            return [
                {
                    source: '/:path((?:admin|profile).*)',
                    destination: '/api/users/authorize?redirect=/:path*',
                    missing: [
                        {
                            type: 'cookie',
                            key: 'zitadel_id_token'
                        }
                    ],
                    permanent: false
                }
            ]
        }
    }
)