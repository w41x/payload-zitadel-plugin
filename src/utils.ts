import {Config, SanitizedConfig} from 'payload'

export const getAuthSlug = (config: Config | SanitizedConfig) => config.admin?.user ?? 'users'

export const getServerURL = (config: Config | SanitizedConfig) => config.serverURL ?? 'http://localhost'

export const getAuthBaseURL = (config: Config | SanitizedConfig) => `${getServerURL(config)}/api/${getAuthSlug(config)}`