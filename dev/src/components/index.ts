import type {CustomComponent} from 'payload'

export const UserInfoServerComponent = {
    path: '/src/components/server',
    exportName: 'UserServerInfo'
} satisfies CustomComponent

export const UserInfoClientComponent = {
    path: '/src/components/client',
    exportName: 'UserClientInfo'
} satisfies CustomComponent