'use client'

import React from 'react'
import {signIn} from 'next-auth/react'
import {CustomComponent} from 'payload'
//import {NestedKeysStripped} from '@payloadcms/translations'
import {Button} from '@payloadcms/ui/client'
//import {useTranslation} from '@payloadcms/ui/providers/Translation'
//import {translations} from '../../translations.js'

export const _LoginButton: CustomComponent = ({internalProviderName, externalProviderName}: {
    internalProviderName: string,
    externalProviderName: string
}) => {
    //currently not working
    //const {t} = useTranslation<typeof translations.en, NestedKeysStripped<typeof translations.en>>()

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button onClick={() => signIn(internalProviderName)}>
                {/*t('zitadelPlugin:signIn', {externalProviderName})*/}
                {externalProviderName}
            </Button>
        </div>
    )
}