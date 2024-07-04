'use client'

import React from 'react'
import {CustomComponent} from 'payload'
import {NestedKeysStripped} from '@payloadcms/translations'
import {Button, useTranslation} from '@payloadcms/ui'
import {translations} from '../../translations.js'
import {NextAuthResult} from 'next-auth'

export const _LoginButton: CustomComponent<{
    signIn: NextAuthResult['signIn'],
    externalProviderName: string
}> = ({signIn, externalProviderName}) => {
    const {t} = useTranslation<typeof translations.en, NestedKeysStripped<typeof translations.en>>()

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={() => signIn()}>
                {t('zitadelPlugin:signIn', {externalProviderName})}
            </Button>
        </div>
    )
}