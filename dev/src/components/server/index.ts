import type {CustomComponent} from 'payload'

export {UserServerInfo} from './UserServerInfo'

export const UserInfoServerComponent = {
    path: '/src/components/server',
    exportName: 'UserServerInfo'
} satisfies CustomComponent