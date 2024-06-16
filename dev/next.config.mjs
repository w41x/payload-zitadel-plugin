import {withPayload} from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'idp.zitadel.url',
                port: '',
                pathname: '/assets/**',
            },
        ],
    }
}

export default withPayload(nextConfig)