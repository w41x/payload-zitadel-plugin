import {withPayload} from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                //protocol: new URL(process.env.ZITADEL_URL).protocol,
                hostname: new URL(process.env.ZITADEL_URL).hostname,
                //port: new URL(process.env.ZITADEL_URL).port,
                pathname: '/assets/**'
            }
        ]
    }
    // optional: enable auto-redirect to Zitadel login page if no logged in
    /*
    async redirects() {
        return [
            {
                source: '/admin/login',
                destination: '/api/users/authorize?redirect=admin',
                permanent: true
            }
        ]
    }
    */
}

export default withPayload(nextConfig)