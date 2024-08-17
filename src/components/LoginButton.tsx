'use client'

import React from 'react'
import {NestedKeysStripped} from '@payloadcms/translations'
import {Button, useConfig, useTranslation} from '@payloadcms/ui'
import {translations} from '../translations.js'
import {PayloadConfigWithZitadelContext} from '../types.js'

export const LoginButton = () => {

    const {t} = useTranslation<typeof translations.en, NestedKeysStripped<typeof translations.en>>()

    const {config: {admin: {custom: {zitadel: {label, authorizeURL}}}}} = useConfig() as PayloadConfigWithZitadelContext

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={() => open(authorizeURL, '_self')}>
                {t('zitadelPlugin:signIn', {label})}
            </Button>
        </div>
    )

}