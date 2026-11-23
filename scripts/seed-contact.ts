/**
 * Seeds the Contact Us page (slug "contact") as a fully dynamic Payload page: a dedicated
 * Contact Hero, an "email the right team" topic grid, a real form-builder contact form with
 * a sidebar (note / support email / social / gambling helpline), a trust grid and an FAQ -
 * all editable from the admin panel, matching the layout of the reference design the user
 * supplied (adapted to our own blocks/typography, our own site name and email addresses).
 *
 * Re-runnable: looked up by slug and updated in place.
 *
 *   npx tsx scripts/seed-contact.ts
 */
import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const ctx = { disableRevalidate: true }

const richText = (text: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      },
    ],
  },
})

const heading = (text: string, tag: 'h2' | 'h3', intro?: string) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag,
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 }],
      },
      ...(intro
        ? [
            {
              type: 'paragraph',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: intro, version: 1 }],
            },
          ]
        : []),
    ],
  },
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titleItem = (title: string, icon?: string) => ({ type: 'title' as const, title, icon: icon as any })
const textItem = (text: string) => ({ type: 'text' as const, text })
const emailChipItem = (email: string) => ({ type: 'emailChip' as const, email, formAnchor: '#form' })

const EMAILS = {
  info: 'info@southafricanbet.co.za',
  media: 'marketing@southafricanbet.co.za',
  support: 'support@southafricanbet.co.za',
}

async function run() {
  const payload = await getPayload({ config: configPromise })

  // ---- contact form (form-builder) ---------------------------------------------------------
  const contactFormData = {
    title: 'Contact Us Form',
    submitButtonLabel: 'Send message',
    confirmationType: 'message' as const,
    confirmationMessage: heading('Thanks for your message!', 'h2'),
    fields: [
      { name: 'firstName', blockName: 'firstName', blockType: 'text' as const, label: 'First name', required: true, width: 50 },
      { name: 'lastName', blockName: 'lastName', blockType: 'text' as const, label: 'Last name', required: true, width: 50 },
      { name: 'email', blockName: 'email', blockType: 'email' as const, label: 'Email', required: true, width: 50 },
      { name: 'phone', blockName: 'phone', blockType: 'text' as const, label: 'Phone (optional)', required: false, width: 50 },
      { name: 'message', blockName: 'message', blockType: 'textarea' as const, label: 'How can we help?', required: true, width: 100 },
      {
        name: 'ageConfirm',
        blockName: 'ageConfirm',
        blockType: 'checkbox' as const,
        label: 'I confirm I am over the age of 18',
        required: true,
        width: 100,
      },
      {
        name: 'termsConfirm',
        blockName: 'termsConfirm',
        blockType: 'checkbox' as const,
        label: 'I agree to the Terms & Privacy Policy',
        required: true,
        width: 100,
      },
    ],
    emails: [
      {
        emailFrom: '"SouthAfricanBet.co.za" <no-reply@southafricanbet.co.za>',
        emailTo: EMAILS.info,
        subject: "You've received a new contact message.",
        message: richText('A new message was submitted through the Contact Us form.'),
      },
    ],
  }

  const existingForm = await payload.find({ collection: 'forms', limit: 1, where: { title: { equals: 'Contact Us Form' } } })
  const contactForm = existingForm.docs[0]
    ? await payload.update({ collection: 'forms', id: existingForm.docs[0].id, data: contactFormData, context: ctx })
    : await payload.create({ collection: 'forms', data: contactFormData, context: ctx })
  payload.logger.info(`Contact form ready (id ${contactForm.id})`)

  // ---- contact page -------------------------------------------------------------------------
  const data = {
    hero: {
      type: 'contactHero' as const,
      badge: 'Contact us',
      headingLine1: "We'd love to",
      headingLine2: '',
      headingHighlight: 'hear from you',
      richText: richText(
        'We help South Africans make smarter, safer choices about online betting and casino gaming. New punter or seasoned bettor, our team can help you find trusted sites, understand the odds and get more out of your play.',
      ),
      links: [
        { link: { type: 'custom' as const, appearance: 'default' as const, label: 'Send a message', url: '#form' } },
      ],
      responseStatus: 'Replies Mon–Fri',
      responseTime: 'Within 24 hrs',
      responseNote: 'Monday to Friday',
      stats: [
        { label: 'SA Time', value: 'GMT+2' },
        { label: 'Team', value: 'Local experts' },
        { label: 'Based In', value: 'South Africa' },
      ],
      helpNote:
        "Account or withdrawal problem? We don't run any betting site. Please contact your bookmaker's support team.",
    },
    layout: [
      {
        blockType: 'flexCols' as const,
        anchorId: 'topics',
        eyebrow: 'Get in touch',
        heading: 'Email the right team',
        intro: 'Pick the topic that fits and your message lands with the people who can answer it.',
        cols: [
          {
            width: 'third' as const,
            items: [
              titleItem('General enquiries', 'message'),
              textItem("Questions about sports betting, casino reviews or bonuses? We'll point you in the right direction."),
              emailChipItem(EMAILS.info),
            ],
          },
          {
            width: 'third' as const,
            items: [
              titleItem('Media & partnerships', 'megaphone'),
              textItem('Advertising, sponsorship or a collaboration idea? Our partnerships team will get back to you.'),
              emailChipItem(EMAILS.media),
            ],
          },
          {
            width: 'third' as const,
            items: [
              titleItem('Corrections & suggestions', 'pencil'),
              textItem("Spotted an outdated bonus, a wrong figure or a broken link? Tell us and we'll fix it."),
              emailChipItem(EMAILS.support),
            ],
          },
        ],
      },
      {
        blockType: 'formBlock' as const,
        anchorId: 'form',
        enableIntro: true,
        form: contactForm.id,
        introContent: heading(
          'Send us a message',
          'h3',
          'Fill in the form and our team will get back to you within 24 hours (Monday to Friday).',
        ),
        sidebar: {
          noteTitle: 'Please note',
          noteText:
            "SouthAfricanBet.co.za is an independent information and review website. We do not operate or manage any betting or casino platform. For account, deposit or withdrawal issues, contact the bookmaker or casino's official support team.",
          noteLinkLabel: "Find a bookmaker's support details in our reviews",
          noteLinkUrl: '/reviews',
          supportTitle: 'Email support',
          supportEmail: EMAILS.support,
          supportNote: "For anything that doesn't fit a topic.",
          showSocial: true,
          showGamblingHelp: true,
        },
      },
      {
        blockType: 'featureGrid' as const,
        anchorId: 'why-us',
        tinted: true,
        eyebrow: 'Why reach out to us?',
        heading: "One of South Africa's most trusted betting information hubs",
        intro:
          'Our goal is simple: help South Africans bet smarter, play responsibly and enjoy the best online gaming experience possible.',
        variant: 'trust' as const,
        items: [
          { title: 'Tested, not copied', description: 'We research, deposit with and review bookmakers ourselves.', trustIcon: 'check' as const },
          { title: '100% South African', description: 'Focused on local sites, rand payments and provincial licences.', trustIcon: 'mapPin' as const },
          { title: 'Independent', description: 'Not owned or influenced by any bookmaker or casino.', trustIcon: 'shield' as const },
          { title: 'No question too small', description: 'Which sportsbook is legit, how a bonus works, what odds mean.', trustIcon: 'message' as const },
        ],
        ctaLink: { type: 'custom' as const, url: '#form', label: 'Send us a message' },
      },
      {
        blockType: 'faqBlock' as const,
        anchorId: 'contact-faq',
        eyebrow: 'FAQs',
        heading: 'Before you write',
        intro: 'Quick answers to the questions we get most.',
        items: [
          {
            question: 'How quickly will you reply?',
            answer:
              'Our team aims to reply to every enquiry within 24 hours, Monday to Friday. Messages sent over a weekend or public holiday are answered on the next working day.',
          },
          {
            question: 'Can you help with my betting account, deposit or withdrawal?',
            answer:
              "No. SouthAfricanBet.co.za is an independent information and review website. We don't run any betting or casino platform, so we can't see or change your account. Please contact the bookmaker's own support team.",
          },
          {
            question: 'How do I advertise or partner with you?',
            answer: `Email ${EMAILS.media} with a short outline of your brand and what you have in mind. We only work with operators licensed by a South African provincial gambling board.`,
          },
          {
            question: 'I found a mistake in a review. What should I do?',
            answer: `Send the page link and what needs changing to ${EMAILS.support}, or use the form above and choose "Corrections & suggestions". We check and update reviews regularly.`,
          },
          {
            question: 'Do you offer betting tips by email?',
            answer:
              "We don't give personal betting advice. Our latest tips and previews are published on the site and shared on our social channels.",
          },
        ],
        ctaLink: { type: 'custom' as const, url: '#form', label: 'Send us a message' },
      },
    ],
    meta: {
      title: 'Contact Us | SouthAfricanBet.co.za',
      description:
        'Get in touch with the SouthAfricanBet.co.za team - general enquiries, media and partnerships, or corrections to a review. We reply within 24 hours.',
    },
    slug: 'contact-us',
    title: 'Contact Us',
    _status: 'published' as const,
  }

  const existing = await payload.find({ collection: 'pages', limit: 1, where: { slug: { equals: 'contact-us' } } })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data, context: ctx })
    payload.logger.info(`Updated contact page (id ${existing.docs[0].id})`)
  } else {
    await payload.create({ collection: 'pages', data, context: ctx })
    payload.logger.info('Created contact page')
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
