# payload-zitadel-plugin

[![NPM](https://nodei.co/npm/payload-zitadel-plugin.png)](https://npmjs.org/package/payload-zitadel-plugin)

plugin for [Payload CMS](https://payloadcms.com), which enables authentication via Zitadel IdP.

The default use case is to fully replace PayloadCMS Auth with Zitadel.
Thus the user collection in PayloadCMS becomes just a shadow of the information in Zitadel.

:boom: :boom: :boom: &nbsp; works :100: with PayloadCMS version :three: &nbsp; :boom: :boom: :boom:

## Install

```shell
pnpm add payload-zitadel-plugin@0.2.6
```

## Configuration

Initialize the plugin in Payload Config File. Change the parameters to connect to your Zitadel Instance.

#### payload.config.ts

```typescript
import {buildConfig} from 'payload/config'
import {ZitadelPlugin} from 'payload-zitadel-plugin'


export default buildConfig({
    ...,
    plugins: [
        ZitadelPlugin({
            // URL of your Zitadel instance
            issuerUrl: process.env.ZITADEL_URL,

            // in Zitadel create a new App->Web->PKCE, then copy the Client ID
            clientId: process.env.ZITADEL_CLIENT_ID,

            // interpolation text for the Login Button - "sign in with ..."
            label: 'Zitadel',

            // set the name of the CustomStrategy in PayloadCMS - usually not necessary
            // strategyName: 'zitadel'

            // set to true if you do not want to use the Zitadel Profile Picture as the Avatar
            // disableAvatar: true

            // set to true if you want to use your own custom login button
            // disableDefaultLoginButton: true

            // if you want to specify the field name for the Zitadel User Id in the users collection
            // associatedIdFieldName: 'idp_id'

            // if you want to manually control what happen after a successful login
            // state contains all URLSearchParams that were send to /authorize
            // onSuccess: (state) => NextResponse.redirect([serverURL, state.get('redirect')].join(''))

            // following properties are only needed if you want to authenticate clients for the API
            // if you are just using the CMS you can ignore all of them
            // in Zitadel create a new App->API->JWT
            // enableAPI: true,
            // apiClientId: process.env.ZITADEL_API_CLIENT_ID,
            // apiKeyId: process.env.ZITADEL_API_KEY_ID,
            // apiKey: process.env.ZITADEL_API_KEY
        })
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

### further configuration

If you want to use the Zitadel profile picture as the avatar in PayloadCMS (`disableAvatar != true`),
you have to manually add the asset URL to the Next.js config file.

Also if you want to automatically redirect to Zitadel without asking the user to click on the login button,
you have to add the redirect manually to the Next.js config file.

#### next.config.js

```typescript
import {withPayload} from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // if Avatar enabled:
    // allow loading assets like profile pictures from Zitadel
    images: {
        remotePatterns: [
            {
                //protocol: new URL(process.env.ZITADEL_URL).protocol,
                hostname: new URL(process.env.ZITADEL_URL).hostname,
                //port: new URL(process.env.ZITADEL_URL).port,
                pathname: '/assets/**'
            }
        ]
    },
    // optional: enable auto-redirect to Zitadel login page if no logged in
    async redirects() {
        return [
            {
                source: '/admin/login',
                destination: `/api/users/authorize?${new URLSearchParams({redirect: '/profile'})}`,
                permanent: true
            }
        ]
    }

}

export default withPayload(nextConfig)
```

## For an example look in this repository at the `dev` directory!