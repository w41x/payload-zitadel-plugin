# payload-zitadel-plugin

[![NPM](https://nodei.co/npm/payload-zitadel-plugin.png)](https://npmjs.org/package/payload-zitadel-plugin)

a plugin for [Payload CMS](https://payloadcms.com) (v3), which enables authentication via Zitadel IdP

The default use case is to fully replace PayloadCMS Auth with Zitadel.
Thus, the user collection in PayloadCMS becomes just a shadow of the information in Zitadel.

## Install

```shell
pnpm add payload-zitadel-plugin@0.5.1
```

## Configuration

Initialize the plugin in the Payload config file. Change the parameters to connect to your Zitadel instance.

The cleanest way to use this plugin is just to set the `ZITADEL_URL` and `ZITADEL_CLIENT_ID` environment variables,
set up the `next.config.ts` as described down below and then add `zitadelPlugin()` without further configuration to the
plugin list.

#### payload.config.ts

```typescript
import {buildConfig} from 'payload'
import {zitadelPlugin} from 'payload-zitadel-plugin'


export default buildConfig({
    ...,
    plugins: [
        zitadelPlugin({
            // URL of your Zitadel instance
            // if not provided, it will look for the ZITADEL_URL environment variable
            // issuerUrl: 'https://idp.zitadel.url',

            // in Zitadel create a new App->Web->PKCE in your project, then copy the Client ID
            // DO NOT FORGET to add '{http://localhost with development mode on or https://your-domain.tld}/api/users/callback'
            // to the allowed redirect URIs and ALSO to the post logout redirect URIs
            // if not provided, it will look for the ZITADEL_CLIENT_ID environment variable
            // clientId: '123456789012345678@project_name',

            // change field names, field labels and also hide them if wanted
            /* 
            fieldConfig: {
                image: {
                    name: 'idp_image',
                    label: 'some custom label'
                }
            }
            */

            // set the name of the CustomStrategy in PayloadCMS - usually not necessary
            // strategyName: 'zitadel'

            /* 
            avatar: {
                // set to true if you do not want to use the Zitadel Profile Picture as the Avatar
                disable: true
            }
            */


            /* 
            loginButton: {
                // set to true if you want to use your own custom login button
                disable: true,
                
                // interpolation text for the Login Button - "sign in with ..."
                label: 'Zitadel'
            }
            */

            // if you want to manually control what happens after a successful login
            // afterLogin: (req) => NextResponse.redirect('...')

            // if you want to manually control what happens after a successful logout
            // afterLogout: (req) => NextResponse.redirect('...')

            // following properties are only needed if you want to authenticate clients 
            // (e.g. a mobile app or a external service) for the API
            // if the users are just visiting the CMS via a browser you can ignore all of them
            // otherwise create in Zitadel a new App->API->JWT and create a new key
            // download the JSON file and put the content in the jwt parameter
            // if not provided it will look for the ZITADEL_API_JWT environment variable
            /* 
            api: {
                type: 'jwt'
                jwt: {
                    keyId: '123456789123456789',
                    key: '-----BEGIN RSA PRIVATE KEY----- ... ----END RSA PRIVATE KEY-----',
                    appId: '123456789123456789',    
                    clientId: '123456789123456789'
                }
            }
            */

            // you can also use basic auth instead of JWT
            // create a new App->API->Basic and save the Client Id and Client Secret
            // if not provided it will look for the ZITADEL_API_CLIENT_ID environment variable
            // make sure you have the ZITADEL_API_JWT environment variable unset as JWT will have priority
            /* 
            api: {
                type: 'basic'
                clientId: '123456789123456789',
                clientSecret: '...'
            }
            */
        })
    ],
    ...
})
```

Optionally you could use an `.env.local` file for parameters:

#### .env.local

```dotenv
ZITADEL_URL=https://idp.zitadel.url
ZITADEL_CLIENT_ID=123456789123456789
# if you use basic auth
ZITADEL_API_CLIENT_ID: '123456789123456789',
ZITADEL_API_CLIENT_SECRET: '...',
# if you use JWT auth
ZITADEL_API_JWT='{"type":"application","keyId":"123456789123456789","key":"-----BEGIN RSA PRIVATE KEY-----\n ... \n-----END RSA PRIVATE KEY-----\n","appId":"123456789123456789","clientId":"123456789123456789"}'
```

or use the Next.js Config file:

#### next.config.ts

```typescript
import {withPayload} from '@payloadcms/next/withPayload'

export default withPayload({
    ...,
    env: {
        ZITADEL_URL: 'https://idp.zitadel.url',
        ZITADEL_CLIENT_ID: '123456789123456789',
        // if you use basic auth
        ZITADEL_API_CLIENT_ID: '123456789123456789',
        ZITADEL_API_CLIENT_SECRET: '...',
        // if you use JWT auth
        ZITADEL_API_JWT='{"type":"application","keyId":"123456789123456789","key":"-----BEGIN RSA PRIVATE KEY-----\n ... \n-----END RSA PRIVATE KEY-----\n","appId":"123456789123456789","clientId":"123456789123456789"}'
    },
    ...
})
```

### further configuration

If you want to use the Zitadel profile picture as the avatar in PayloadCMS,
you have to manually add the asset URL to the Next.js config file.

For a proper logout you have to add the `end_session` redirect.

Also, if you want to automatically redirect to Zitadel without asking the user to click on the login button,
you have to add the redirect manually to the Next.js config file.

#### next.config.ts

```typescript
import {withPayload} from '@payloadcms/next/withPayload'

export default withPayload({
    ...,

    // if Avatar enabled:
    // allow loading assets like profile pictures from Zitadel
    images: {
        remotePatterns: [
            {
                // protocol: new URL(process.env.ZITADEL_URL).protocol,
                hostname: new URL(process.env.ZITADEL_URL).hostname,
                // port: new URL(process.env.ZITADEL_URL).port,
                pathname: '/assets/**'
            }
        ]
    },

    async redirects() {
        return [
            // for proper logout
            {
                // all paths, that do not start with 'api'
                // it is important to ignore the Payload API routes!
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
            // optional: enable auto-redirect to Zitadel login page if not logged in
            {
                // all paths that start with 'admin' or 'profile'
                // you could replace 'profile' with 'app' or some other protected route
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
    },

    ...

})
```

## For an example look in this repository at the `dev` directory!