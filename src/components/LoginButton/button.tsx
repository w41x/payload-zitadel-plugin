'use client'

import React from 'react'
import {signIn} from 'next-auth/react'
import {CustomComponent} from 'payload'
import {NestedKeysStripped} from '@payloadcms/translations'
import {Button, useTranslation} from '@payloadcms/ui'
import {translations} from '../../translations.js'

export const _LoginButton: CustomComponent<{
    internalProviderName: string,
    externalProviderName: string
}> = ({internalProviderName, externalProviderName}) => {
    const {t} = useTranslation<typeof translations.en, NestedKeysStripped<typeof translations.en>>()

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={() => signIn(internalProviderName)}>
                {t('zitadelPlugin:signIn', {externalProviderName})}
            </Button>
        </div>
    )
}