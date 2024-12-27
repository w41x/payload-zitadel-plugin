import React from 'react'
import {Button} from '@payloadcms/ui'
import type {ZitadelLoginButtonProps} from '../../../types.js'
import {ROUTES} from '../../../constants.js'
import {getAuthBaseURL} from '../../../utils.js'

export const LoginButton = async ({payload: {config}, i18n, label}: ZitadelLoginButtonProps) =>
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button el="anchor" url={getAuthBaseURL(config) + ROUTES.authorize}>
            {i18n.t('zitadelPlugin:signIn', {label})}
        </Button>
    </div>