import {withPayload} from '@payloadcms/next/withPayload'
import {withZitadel} from './src/config/zitadel-plugin.js'

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withPayload(withZitadel(nextConfig))