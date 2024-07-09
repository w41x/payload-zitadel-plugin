'use client'

import React from 'react'
import {NestedKeysStripped} from '@payloadcms/translations'
import {Button, useConfig, useTranslation} from '@payloadcms/ui'
import {translations} from '../translations.js'

export const LoginButton = () => {

    const {t} = useTranslation<typeof translations.en, NestedKeysStripped<typeof translations.en>>()

    const {admin: {custom: {oidc: {label}}}} = useConfig()

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={() => open('http://localhost/api/users/authorize', '_self')}>
                {t('oidcPlugin:signIn', {label})}
            </Button>
        </div>
    )

}