import type {CollectionConfig} from 'payload'

export const Users: CollectionConfig = {
    slug: 'users',
    labels: {
        singular: 'User',
        plural: 'Users'
    },
    fields: [
        {
            name: 'custom-field',
            label: 'some custom field',
            type: 'text'
        }
    ]
}