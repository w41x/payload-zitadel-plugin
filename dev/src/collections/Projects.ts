import {CollectionConfig} from 'payload/types'

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