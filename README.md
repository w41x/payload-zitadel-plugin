# payload-zitadel-plugin

[![NPM](https://nodei.co/npm/payload-zitadel-plugin.png)](https://npmjs.org/package/payload-zitadel-plugin)

plugin for [Payload CMS](https://payloadcms.com), which enables authentication via Zitadel IdP.

:boom: :boom: :boom: &nbsp; works :100: with PayloadCMS version :three: &nbsp; :boom: :boom: :boom:

## Install

```shell
pnpm add payload-zitadel-plugin@0.2.0
```

## Configuration

Initialize the plugin in Payload Config File. Change the parameters to connect to your Zitadel Instance.

#### payload.config.ts

```typescript
import {buildConfig} from 'payload/config'

export default buildConfig({
    ...,
    plugins: [
        zitadelPlugin
    ],
    ...
})
```

Optionally you could use an `.env.local` file for parameters:

#### .env.local

```dotenv
NEXTAUTH_URL=http://localhost
NEXTAUTH_SECRET=pMvElMzVrLvGL4tHyqtDlVP/90wQdxGBy94ISifi62I=
ZITADEL_URL=https://idp.zitadel.url
ZITADEL_CLIENT_ID=123456789012345678@project_name
ZITADEL_API_CLIENT_ID=123456789123456789@project_name
ZITADEL_API_KEY_ID=123456789012345678
ZITADEL_API_KEY='-----BEGIN RSA PRIVATE KEY----- ... ----END RSA PRIVATE KEY-----'
```

or use the Next.js Config file:

#### next.config.js

```typescript
import {withPayload} from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: 'http://localhost',
        NEXTAUTH_SECRET: 'mQ46qpFwfE1BHuqMC+qlm19qBAD9fVPgh28werwe3ASFlAfnKjM=',
        ZITADEL_URL: 'https://idp.zitadel.url',
        ZITADEL_CLIENT_ID: '123456789012345678@project_name',
        ZITADEL_API_CLIENT_ID: '123456789123456789@project_name',
        ZITADEL_API_KEY_ID: '123456789012345678',
        ZITADEL_API_KEY: '-----BEGIN RSA PRIVATE KEY----- ... ----END RSA PRIVATE KEY-----'
    }
}

export default withPayload(nextConfig)
```

### create route

Unfortunately you need to manually create the following NextAuth.js route in your Next.js App (using App Router):

### (nextauth)/api/auth/[...nextauth]/route.ts

```typescript
import {handlers} from '@/config/zitadel-plugin'

export const {GET, POST} = handlers
```

### add profile picture url to accepted Next.js assets

If you want to use the Zitadel profile picture as the avatar in PayloadCMS (`disableAvatar != true`), 
you have to manually add the asset URL to the Next.js config file.

#### next.config.js

```typescript
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
}

export default withPayload(nextConfig)
```

## For an example look in this repository at the `dev` directory!