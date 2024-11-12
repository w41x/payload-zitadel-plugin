/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

import React, {PropsWithChildren} from 'react'
import type {ServerFunctionClient} from 'payload'
import config from '@payload-config'
import {handleServerFunctions, RootLayout} from '@payloadcms/next/layouts'
import {importMap} from './admin/importMap'

import '@payloadcms/next/css'

const serverFunction: ServerFunctionClient = async function (args) {
    'use server'
    return handleServerFunctions({
        ...args,
        config,
        importMap
    })
}

const Layout = ({children}: PropsWithChildren) =>
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>

export default Layout