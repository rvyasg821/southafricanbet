import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { ALL_SECTION_BLOCKS } from '../../blocks/allBlocks'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidateReview } from './hooks/revalidateReview'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Reviews: CollectionConfig<'reviews'> = {
  slug: 'reviews',
  defaultSort: 'rank',
  labels: {
    plural: 'Reviews',
    singular: 'Review',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a review is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  defaultPopulate: {
    title: true,
    slug: true,
    rating: true,
    rank: true,
    icon: true,
    brandColor: true,
    playNowUrl: true,
    bonusText: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'rank', 'rating', 'featured', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'reviews',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'reviews',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { width: '40%' },
          label: 'Bookmaker Name',
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          admin: { step: 0.1, width: '30%' },
          label: 'Rating (out of 5)',
          max: 5,
          min: 0,
          required: true,
        },
        {
          name: 'rank',
          type: 'number',
          admin: {
            description: 'Lower shows first',
            width: '30%',
          },
          label: 'Rank',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'icon',
              type: 'upload',
              label: 'Logo',
              relationTo: 'media',
              admin: {
                description: 'Optional — when empty, a colored initials badge is shown instead.',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'subTitle',
              type: 'text',
              label: 'Sub Title / Tagline',
            },
            {
              name: 'bestFor',
              type: 'text',
              label: 'Best For (e.g. "Casino & sports combined")',
            },
            {
              name: 'whyWeLoveIt',
              type: 'text',
              label: 'Why We Love It',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bonusText',
                  type: 'text',
                  admin: { width: '50%' },
                  label: 'Bonus Headline',
                  required: true,
                },
                {
                  name: 'promotionalCode',
                  type: 'text',
                  admin: { width: '50%' },
                  label: 'Promo Code',
                },
              ],
            },
            {
              name: 'playNowUrl',
              type: 'text',
              admin: {
                description:
                  'Affiliate / "Play Now" link. Every Play Now and Claim Bonus button on this review page uses this one link. For a third-party site, enter the local redirect link (e.g. /links/10bet) — it opens the "Redirecting…" page first. Add the destination under Outgoing Links.',
              },
              label: 'Play Now link',
            },
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
              ],
              label: 'Feature Checklist',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minDeposit',
                  type: 'text',
                  admin: { width: '33%' },
                  label: 'Min Deposit',
                },
                {
                  name: 'payoutTime',
                  type: 'text',
                  admin: { width: '33%' },
                  label: 'Payout Time',
                },
                {
                  name: 'gamesOffered',
                  type: 'text',
                  admin: { width: '34%' },
                  label: 'Games Offered',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'winRate',
                  type: 'text',
                  admin: { width: '33%' },
                  label: 'Win Rate (e.g. 98%)',
                },
                {
                  name: 'wagering',
                  type: 'text',
                  admin: { width: '33%' },
                  label: 'Wagering (e.g. N/A)',
                },
                {
                  name: 'badge',
                  type: 'text',
                  admin: { width: '34%' },
                  label: 'Ribbon label (e.g. "Editor\'s Choice")',
                },
              ],
            },
            {
              name: 'brandColor',
              type: 'text',
              admin: {
                description: 'Hex colour of the initials badge shown when no logo is uploaded, e.g. #ea580c.',
              },
              label: 'Brand colour',
            },
            {
              name: 'paymentMethods',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
              label: 'Payment Methods',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Full Review',
            },
            {
              name: 'termsConditions',
              type: 'textarea',
              label: 'Terms & Conditions',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'pageHero',
              type: 'group',
              admin: {
                description:
                  'Top of the review page. Logo, rating, bonus headline, Play Now link and payment methods come from the Content tab.',
              },
              fields: [
                { name: 'licenceBadge', type: 'text', label: 'Badge above the title (e.g. Licensed in South Africa)' },
                { name: 'titleSuffix', type: 'text', label: 'Gradient word after "Review" (e.g. 2026)' },
                { name: 'summary', type: 'textarea', label: 'Intro paragraph' },
                { name: 'author', type: 'text', defaultValue: 'SouthAfricanBet Review Team', label: 'Reviewed by' },
                { name: 'scoreLabel', type: 'text', defaultValue: 'Excellent', label: 'Score word (e.g. Excellent)' },
                { name: 'rankText', type: 'text', label: 'Ranking line (leave empty to use the Rank)' },
                { name: 'offerLabel', type: 'text', defaultValue: 'Exclusive welcome offer', label: 'Offer card label' },
                { name: 'bonusSubtext', type: 'text', label: 'Line under the bonus headline' },
                { name: 'bonusFinePrint', type: 'text', label: 'Small print under the button' },
                { name: 'ctaLabel', type: 'text', defaultValue: 'Claim bonus', label: 'Offer button label' },
                {
                  name: 'stats',
                  type: 'array',
                  admin: { description: 'Stat strip under the hero (e.g. Established, Sports covered).' },
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'value', type: 'text', required: true },
                  ],
                  maxRows: 8,
                },
              ],
              label: 'Page Hero',
            },
          ],
          label: 'Page Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              admin: { initCollapsed: true },
              blocks: ALL_SECTION_BLOCKS,
              label: 'Page Sections',
            },
          ],
          label: 'Page Sections',
        },
        {
          fields: [
            {
              name: 'relatedReviews',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'reviews',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: 'Show this bookmaker in "Top Picks" style blocks by default',
        position: 'sidebar',
      },
      label: 'Featured',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateReview],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
