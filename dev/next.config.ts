import {withPayload} from '@payloadcms/next/withPayload'

export default withPayload({
        images: {
            remotePatterns: [
                {
                    hostname: new URL(process.env.ZITADEL_URL ?? '').hostname,
                    pathname: '/assets/**'
                }
            ]
        },

        async redirects() {
            return [
                {
                    source: '/:path((?!api).*)',
                    destination: '/api/users/end_session?redirect=/:path*',
                    has: [
                        {
                            type: 'cookie',
                            key: 'zitadel_logout'
                        }
                    ],
                    permanent: false
                },
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