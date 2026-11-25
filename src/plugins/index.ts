import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { payloadTheme } from 'payload-theme'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { APIError, type CollectionBeforeValidateHook, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post, Review } from '@/payload-types'
import { verifyCaptcha } from '@/utilities/captcha'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page | Review> = ({ doc }) => {
  return doc?.title ? `${doc.title} | SouthAfricanBet` : 'SouthAfricanBet'
}

const generateURL: GenerateURL<Post | Page | Review> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

/** Public contact-form posts must carry a valid Turnstile token (sent in the x-captcha-token header). */
const requireCaptcha: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (operation !== 'create' || req.user || req.payloadAPI === 'local') return data

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (!(await verifyCaptcha(req.headers.get('x-captcha-token'), ip))) {
    throw new APIError('Captcha check failed. Please try again.', 400, undefined, true)
  }
  return data
}

export const plugins: Plugin[] = [
  payloadTheme({
    accent: '#e11d2e',
    logo: { dark: '/media/logo-full-dark.png', light: '/media/logo-full.png' },
    logoHeight: 42,
    login: { heading: 'Welcome back', tagline: 'Sign in to manage SouthAfricanBet.co.za.' },
    nav: {
      icons: {
        categories: 'tag',
        footer: 'panel-bottom',
        forms: 'clipboard-list',
        'form-submissions': 'inbox',
        header: 'panel-top',
        media: 'image',
        'outgoing-links': 'external-link',
        pages: 'file-text',
        posts: 'newspaper',
        redirects: 'corner-up-right',
        reviews: 'star',
        search: 'search',
        subscribers: 'mail',
        users: 'users',
      },
    },
    radius: 'lg',
  }),
  redirectsPlugin({
    collections: ['pages', 'posts', 'reviews'],
    overrides: {
      admin: { group: 'Settings' },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: { group: 'Marketing' },
      hooks: { beforeValidate: [requireCaptcha] },
    },
    formOverrides: {
      admin: { group: 'Marketing' },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts', 'reviews'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: { group: 'Settings' },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
