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
                firstName: profile.given_name,
                lastName: profile.family_name,
                email: profile.email,
                loginName: profile.preferred_username,
                image: profile.picture
            }),
            clientId
        }
    ],
    callbacks: {
        session: async ({session, token}) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub
            }
        })
    }
})