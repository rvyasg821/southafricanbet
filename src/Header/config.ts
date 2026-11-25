import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      admin: {
        description:
          'Optional site logo image. If left empty, the text-based "SouthAfricanBet" logo is used instead.',
      },
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'iconImage',
          type: 'upload',
          admin: {
            description:
              'Optional custom icon image for this menu link. If set, it takes priority over the icon picked in the link\'s "Icon" field above.',
          },
          label: 'Custom icon image',
          relationTo: 'media',
        },
        {
          name: 'hasDropdown',
          type: 'checkbox',
          admin: {
            description: 'Show a dropdown chevron next to this item',
          },
          label: 'Has dropdown',
        },
        {
          name: 'children',
          type: 'array',
          admin: {
            description: 'Dropdown links shown under this item (when "Has dropdown" is ticked).',
            initCollapsed: true,
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true },
          ],
          label: 'Dropdown links',
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA button (e.g. "Get Bonus")',
      },
    }),
    {
      name: 'noticeText',
      type: 'text',
      admin: {
        description: 'Top bar message. Defaults to "Gambling can be addictive. Please play responsibly."',
      },
      label: 'Top bar notice',
    },
    {
      name: 'helplineNumber',
      type: 'text',
      admin: {
        description: 'e.g. 0800 006 008 (National Responsible Gambling Programme)',
      },
      label: 'Responsible gambling helpline',
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
