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
                    source: '/admin/login',
                    destination: `/api/users/authorize?${new URLSearchParams({redirect: '/admin'})}`,
                    missing: [
                        // not logged in
                        {
                            type: 'cookie',
                            key: 'payload-token'
                        }
                    ],
                    permanent: false
                },
                {
                    source: '/admin',
                    destination: '/api/users/redirect',
                    has: [
                        // logging in
                        {
                            type: 'cookie',
                            key: 'zitadel_state'
                        }
                    ],
                    permanent: false
                },
                {
                    source: '/profile/:path',
                    destination: `/api/users/authorize?${new URLSearchParams({redirect: '/profile'})}`,
                    missing: [
                        // not logged in
                        {
                            type: 'cookie',
                            key: 'payload-token'
                        }
                    ],
                    permanent: false
                }
            ]
        }
    }
)