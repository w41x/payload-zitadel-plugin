import React from 'react'
import {_LoginButton} from './button.js'

export const LoginButton = ({internalProviderName, externalProviderName}: {
    internalProviderName: string,
    externalProviderName: string
}) => () => <_LoginButton internalProviderName={internalProviderName} externalProviderName={externalProviderName}/>