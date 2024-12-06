import type {CustomComponent} from 'payload'
import {COMPONENTS_PATH} from '../../constants.js'

export {LoginButton} from './LoginButton.js'

export const LoginButtonComponent = {
    path: `${COMPONENTS_PATH}/server`,
    exportName: 'LoginButton'
} satisfies CustomComponent