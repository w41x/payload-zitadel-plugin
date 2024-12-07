import type {CustomComponent} from 'payload'
import {COMPONENTS_PATH} from '../constants.js'

export const AvatarComponent = {
    path: `${COMPONENTS_PATH}/client`,
    exportName: 'Avatar'
} satisfies CustomComponent

export const LoginButtonComponent = {
    path: `${COMPONENTS_PATH}/server`,
    exportName: 'LoginButton'
} satisfies CustomComponent