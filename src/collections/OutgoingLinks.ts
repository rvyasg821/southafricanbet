import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

/**
 * The CMS version of the old WordPress `/links/<name>.html` files. Each record is one third-party
 * (affiliate) destination, served through the "Redirecting…" page at `/links/<slug>`. Only slugs
 * stored here can be redirected to, so the page can't be abused as an open redirect.
 */
export const OutgoingLinks: CollectionConfig<'outgoing-links'> = {
  slug: 'outgoing-links',
  labels: {
    plural: 'Outgoing Links',
    singular: 'Outgoing Link',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'url', 'updatedAt'],
    description:
      'Third-party links shown through the "Redirecting…" page. Use /links/<slug> (e.g. /links/10bet) as the Play Now link anywhere on the site.',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Shown on the redirect page, e.g. "10Bet".' },
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'The full third-party / affiliate URL, starting with https://' },
      label: 'Destination URL',
      required: true,
      validate: (value: null | string | undefined) =>
        value && /^https?:\/\/\S+$/i.test(value) ? true : 'Enter a full URL starting with http:// or https://',
    },
    slugField(),
  ],
}
