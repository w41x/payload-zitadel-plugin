import {withPayload} from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'id.vmfk.eu',
                port: '',
                pathname: '/assets/**',
            },
        ],
    }
}

export default withPayload(nextConfig)