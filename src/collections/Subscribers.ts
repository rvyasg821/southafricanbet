import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

/** Newsletter signups from the footer form. Created server-side by /next/subscribe (captcha-checked). */
export const Subscribers: CollectionConfig<'subscribers'> = {
  slug: 'subscribers',
  labels: {
    plural: 'Subscribers',
    singular: 'Subscriber',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'createdAt'],
    description: 'Email addresses collected by the footer newsletter form.',
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      index: true,
      required: true,
      unique: true,
    },
  ],
}
