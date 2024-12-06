import type {CustomComponent} from 'payload'
import {COMPONENTS_PATH} from '../../constants.js'

export {Avatar} from './Avatar.js'

export const AvatarComponent = {
    path: `${COMPONENTS_PATH}/client`,
    exportName: 'Avatar'
} satisfies CustomComponent