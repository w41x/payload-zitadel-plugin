'use server'

import process from 'node:process'
import {PayloadHandler} from 'payload'
import {NextResponse} from 'next/server.js'
import {PayloadConfigWithZitadel} from '../types.js'
import {COOKIES} from '../constants.js'

export const authorize: PayloadHandler = async ({searchParams, payload: {config}}) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, callbackURL}}}} = config as PayloadConfigWithZitadel

    const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64url')

    const code_challenge = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code_verifier))).toString('base64url')

    const response = NextResponse.redirect(`${issuerURL}/oauth/v2/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackURL,
        response_type: 'code',
        scope: 'openid email profile',
        state: btoa(searchParams.toString()),
        code_challenge,
        code_challenge_method: 'S256'
    })}`)

    response.cookies.set({
        name: COOKIES.pkce,
        value: code_verifier,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
        secure: process.env.NODE_ENV == 'production'
    })

    return response

}
