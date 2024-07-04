import React from 'react'
import {_LoginButton} from './button.js'
import {NextAuthResult} from 'next-auth'

export const LoginButton = ({signIn, externalProviderName}: {
    signIn: NextAuthResult['signIn'],
    externalProviderName: string
}) => () => <_LoginButton signIn={signIn} externalProviderName={externalProviderName}/>