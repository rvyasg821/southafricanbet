import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      admin: {
        description: 'Light/white logo used on the dark footer. Falls back to the text logo.',
      },
      label: 'Footer logo',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Brand blurb under the logo',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'columns',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'navItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 10,
        },
      ],
      label: 'Link Columns',
      maxRows: 4,
    },
    {
      name: 'newsletter',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Newsletter' },
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Get the latest free bonus offers',
        },
        {
          name: 'disclaimer',
          type: 'text',
          defaultValue: 'One email a week. No spam, unsubscribe anytime.',
        },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Subscribe' },
      ],
      label: 'Newsletter Signup',
    },
    {
      name: 'licensingAuthorities',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
      label: 'Licensing Authorities',
    },
    {
      name: 'responsibleGamblingText',
      type: 'textarea',
      defaultValue: 'Gambling can be addictive, please play responsibly. You must be 18 or older to bet online in South Africa.',
      label: 'Responsible Gambling Banner Text',
    },
    {
      name: 'responsibleGamblingSubtext',
      type: 'textarea',
      label: 'Responsible Gambling Banner Sub-text',
    },
    {
      name: 'helplineNumber',
      type: 'text',
      label: 'Responsible gambling helpline',
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright line',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'X', value: 'x' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
      label: 'Social links',
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
