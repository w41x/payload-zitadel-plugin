import {withPayload} from '@payloadcms/next/withPayload'

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
        async redirects() {
            return [
                {
                    source: '/admin/:path',
                    destination: `/api/users/authorize?${new URLSearchParams({redirect: '/admin/:path'})}`,
                    missing: [
                        // not logged in
                        {
                            type: 'cookie',
                            key: 'zitadel_id_token'
                        }
                    ],
                    permanent: false
                },
                {
                    source: '/profile/:path',
                    destination: `/api/users/authorize?${new URLSearchParams({redirect: '/profile/:path'})}`,
                    missing: [
                        // not logged in
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