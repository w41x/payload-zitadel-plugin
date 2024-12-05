import type {Metadata} from 'next'
import config from '@payload-config'
import {RootPage, generatePageMetadata} from '@payloadcms/next/views'
import {importMap} from '../importMap'
import type {Args} from './types'

export const generateMetadata = ({params, searchParams}: Args): Promise<Metadata> =>
    generatePageMetadata({config, params, searchParams})

const Page = ({params, searchParams}: Args) => RootPage({config, importMap, params, searchParams})

export default Page