import type {CollectionConfig} from 'payload'

export const Projects: CollectionConfig = {
    slug: 'projects',
    labels: {
        singular: 'Project',
        plural: 'Projects'
    },
    fields: [
        {
            name: 'name',
            type: 'text'
        }
    ]
}