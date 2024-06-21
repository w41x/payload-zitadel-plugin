import {ZitadelAuthOptionsType} from './types.js'

export const authOptions: ZitadelAuthOptionsType = ({internalProviderName, issuerUrl, clientId}) => ({
    providers: [
        {
            id: internalProviderName,
            name: internalProviderName,
            type: 'oauth',
            version: '2',
            wellKnown: issuerUrl,
            authorization: {
                params: {
                    scope: 'openid email profile'
                }
            },
            idToken: true,
            checks: ['pkce', 'state'],
            client: {
                token_endpoint_auth_method: 'none'
            },
            profile: async (profile) => ({
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                loginName: profile.preferred_username,
                image: profile.picture,
                firstName: profile.given_name,
                lastName: profile.family_name,
                gender: profile.gender,
                locale: profile.locale,
                roles: profile['urn:zitadel:iam:org:project:roles'],
            }),
            clientId
        }
    ],
    callbacks: {
        jwt: async ({user, token}) => ({
            ...token,
            ...(user ? {user} : {})
        }),
        session: async ({session, token}) => ({
            ...session,
            user: {
                ...token.user,
                ...session.user
            }
        })
    }
})