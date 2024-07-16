'use server'

import {cookies} from 'next/headers.js'
import process from 'node:process'
import {PayloadHandler} from 'payload'
import {NextResponse} from 'next/server.js'
import {PayloadConfigWithZitadel} from '../types.js'

const genCodeChallenge = async () => {

    const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('base64url')

    cookies().set({
        name: 'pkce_code_verifier',
        value: code_verifier,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 300,
        secure: process.env.NODE_ENV == 'production'
    })

    return Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code_verifier))).toString('base64url')

}

export const authorize: PayloadHandler = async ({searchParams, payload: {config}}) => {

    const {admin: {custom: {zitadel: {issuerURL, clientId, callbackURL}}}} = config as PayloadConfigWithZitadel

    return NextResponse.redirect(`${issuerURL}/oauth/v2/authorize?${new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackURL,
        response_type: 'code',
        scope: 'openid email profile',
        state: btoa(searchParams.toString()),
        code_challenge: await genCodeChallenge(),
        code_challenge_method: 'S256'
    })}`)

}
