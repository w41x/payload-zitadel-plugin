import React from 'react'
import {Button} from '@payloadcms/ui'
import type {ZitadelLoginButtonProps} from '../../../types.js'

export const LoginButton = async ({i18n, authorizeURL, label}: ZitadelLoginButtonProps) =>
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button el="anchor" url={authorizeURL}>
            {i18n.t('zitadelPlugin:signIn', {label})}
        </Button>
    </div>