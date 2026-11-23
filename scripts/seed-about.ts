/**
 * Seeds the About Us page using the redesigned layout (About Hero, Who We Are + checklist,
 * Team Spotlight, What We Do, 10-point checklist, Why Trust Us, Licensing, and a final
 * responsible-gambling + community row), following the reference design the user supplied,
 * adapted to our own blocks/typography and our own site name.
 *
 * Re-runnable: looked up by slug and updated in place.
 *
 *   npx tsx scripts/seed-about.ts
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

const titleItem = (title: string) => ({ type: 'title' as const, title })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconHeaderItem = (icon: string, title: string) => ({ type: 'title' as const, icon: icon as any, inlineIcon: true, title })
const textItem = (text: string) => ({ type: 'text' as const, text })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checklistItem = (icon: string, title: string) => ({ type: 'checklistItem' as const, icon: icon as any, title })
const buttonItem = (label: string, url: string) => ({ type: 'button' as const, btn: { type: 'custom' as const, label, url } })

async function run() {
  const payload = await getPayload({ config: configPromise })

  const data = {
    hero: {
      type: 'aboutHero' as const,
      badge: 'About us',
      headingLine1: 'Bet smarter. Play safer.',
      headingHighlight: 'Enjoy it all.',
      richText: richText(
        "Welcome to SouthAfricanBet.co.za, South Africa's trusted source for honest, expert betting and casino information. We started with one clear mission: to help South Africans bet smarter, play safer and enjoy online gaming with confidence.",
      ),
      links: [
        { link: { type: 'custom' as const, appearance: 'default' as const, label: 'How we review', url: '#how' } },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      missionIcon: 'zap' as any,
      missionEyebrow: 'Our mission',
      missionQuote: "To be South Africa's most reliable and complete source of online betting and casino information.",
      missionCaption:
        'We cut through the marketing noise and deliver facts: tested, verified and written for everyday South Africans.',
      miniStats: [
        { icon: 'mapPin' as const, title: '100% South African', subtitle: 'Local market focus' },
        { icon: 'shield' as const, title: 'Independent', subtitle: 'Not owned by any bookmaker' },
        { icon: 'listChecks' as const, title: '10-point checklist', subtitle: 'For every review' },
        { icon: 'ban' as const, title: '18+ only', subtitle: 'Responsible play first' },
      ],
    },
    layout: [
      {
        blockType: 'flexCols' as const,
        anchorId: 'who-we-are',
        cols: [
          {
            width: 'half' as const,
            noCard: true,
            items: [
              { type: 'sectionHeading' as const, eyebrowText: 'Who we are', title: 'A proudly South African team' },
              textItem(
                'We have years of experience in sports betting, casino gaming and iGaming journalism. Our team of local betting enthusiasts, analysts and writers live and breathe the South African betting scene, from rugby, cricket and soccer to the latest online casino games.',
              ),
              textItem(
                "We know the local market inside out: the bookmakers, the bonuses, and the best (and worst) platforms to use. We don't just promote betting sites, we test them thoroughly. We dig deep so you don't have to.",
              ),
            ],
          },
          {
            width: 'half' as const,
            gradientCard: true,
            items: [
              iconHeaderItem('search', 'Every site we review is checked for'),
              checklistItem('shield', 'Safety'),
              checklistItem('scale', 'Licensing'),
              checklistItem('banknote', 'Payout reliability'),
              checklistItem('smartphone', 'Mobile performance'),
              checklistItem('creditCard', 'Local payment options'),
            ],
          },
        ],
      },
      {
        blockType: 'teamSpotlight' as const,
        anchorId: 'team',
        tinted: true,
        eyebrow: 'Meet our lead expert',
        heading: 'The person behind our reviews',
        initials: 'DK',
        name: 'Dennis Kumar',
        role: 'Lead Betting Expert',
        verifiedLabel: 'Verified author',
        bioLead: 'Dennis brings',
        bioBold: 'over a decade of hands-on experience',
        bioRest:
          'in sports betting and casino analysis. Having worked closely with major operators and written extensively about the South African betting landscape, he makes sure our reviews and guides are accurate, practical and trustworthy.',
        tags: [{ label: 'Sports betting' }, { label: 'Casino analysis' }, { label: 'SA regulation' }, { label: 'Bonus terms' }],
        authorLink: { type: 'custom' as const, label: 'Browse bookmaker reviews', url: '/reviews' },
      },
      {
        blockType: 'featureGrid' as const,
        anchorId: 'what-we-do',
        eyebrow: 'What we do',
        heading: 'We make betting simple and transparent',
        intro: "Here's what you'll find on SouthAfricanBet.co.za.",
        variant: 'steps' as const,
        items: [
          { title: 'Independent bookmaker and casino reviews', description: 'Honest ratings and real user insights.' },
          { title: 'Sports betting tips and strategies', description: 'From rugby and soccer to cricket and horse racing.' },
          { title: 'Casino game guides', description: 'Learn about slots, roulette, blackjack and more.' },
          { title: 'Industry news and updates', description: 'Stay informed about new sites, bonuses and SA regulations.' },
        ],
        ctaLink: { type: 'custom' as const, url: '/reviews', label: 'Learn more' },
      },
      {
        blockType: 'featureGrid' as const,
        anchorId: 'how',
        tinted: true,
        eyebrow: 'How we review',
        heading: 'Our 10-point checklist',
        intro:
          'We open real accounts, deposit our own money, claim the bonus, place bets and withdraw. Every bookmaker is scored on the same ten points, and scores are never for sale.',
        variant: 'criteria' as const,
        calloutLead: 'Fully independent.',
        callout: "We're not owned or influenced by any bookmaker or casino, so our reviews stay unbiased.",
        items: [
          { title: 'Licensing & Trust', description: 'Valid provincial licence and a clean regulatory record.' },
          { title: 'Security & Trust', description: 'Encryption, safe payments and data protection.' },
          { title: 'Ease of Registration', description: 'How quickly a new player can sign up and verify.' },
          { title: 'Payment Options', description: 'EFT, cards, vouchers and mobile wallets.' },
          { title: 'Bonuses & Promotions', description: 'Fair welcome offers with clear wagering terms.' },
          { title: 'Markets & Specials', description: 'Depth of rugby, soccer, cricket and racing markets.' },
          { title: 'Mobile Experience', description: 'App and mobile-site speed and usability.' },
          { title: 'Customer Support', description: 'Response time and quality of live chat and email.' },
          { title: 'Withdrawal Speed', description: 'How fast real withdrawals actually land.' },
          { title: 'Responsible Gambling', description: 'Limits, self-exclusion and player-protection tools.' },
        ],
        ctaLink: { type: 'custom' as const, url: '/reviews', label: 'Learn more' },
      },
      {
        blockType: 'featureGrid' as const,
        eyebrow: 'Why trust us',
        heading: 'Facts first, marketing never',
        variant: 'trust' as const,
        items: [
          { title: 'Local knowledge', description: '100% focused on the South African betting market.', trustIcon: 'mapPin' as const },
          { title: 'Independent reviews', description: 'Every site we recommend is fully tested by our team.', trustIcon: 'check' as const },
          { title: 'Straightforward advice', description: 'No jargon, no confusion, just clear and honest information.', trustIcon: 'sparkles' as const },
          { title: 'Expert insight', description: 'Led by betting expert Dennis Kumar, with years of local and international experience.', trustIcon: 'users' as const },
        ],
        ctaLink: { type: 'custom' as const, url: '/reviews', label: 'Browse bookmaker reviews' },
      },
      {
        blockType: 'licensingBlock' as const,
        tinted: true,
        eyebrow: 'Licensing',
        heading: 'Licensed operators only',
        intro: 'We only recommend bookmakers licensed by a South African provincial gambling board.',
        authoritiesHeading: 'Provincial Gambling Boards',
        authorities: [
          { name: 'Western Cape Gambling and Racing Board (WCGRB)' },
          { name: 'Gauteng Gambling Board (GGB)' },
          { name: 'KwaZulu-Natal Gaming and Betting Board (KZNGBB)' },
          { name: 'Eastern Cape Gambling and Betting Board (ECGBB)' },
          { name: 'Free State Gambling, Liquor and Tourism Authority' },
          { name: 'Northern Cape Gambling Board (NCGB)' },
        ],
        benefitsHeading: 'Why Licensing Matters',
        benefits: [
          { text: 'Your money and personal data are protected.' },
          { text: 'Games and odds are independently audited.' },
          { text: 'You have a formal process if something goes wrong.' },
          { text: 'Operators are regularly checked for fair play.' },
          { text: 'Your winnings are legally protected under SA law.' },
        ],
      },
      {
        blockType: 'flexCols' as const,
        cols: [
          {
            width: 'half' as const,
            noCard: true,
            items: [
              {
                type: 'helpCard' as const,
                icon: 'lifebuoy' as const,
                title: 'We believe in responsible gambling',
                text: 'Our goal is to help you bet within your limits, stay safe online and always keep betting fun.',
                statLabel: 'SA Responsible Gambling Foundation',
                statValue: '0800 006 008',
              },
            ],
          },
          {
            width: 'half' as const,
            items: [
              titleItem("Proud to be part of South Africa's betting community"),
              textItem(
                'Explore our reviews, check out our latest tips and follow us on social media for updates and expert insights.',
              ),
              { type: 'socialRow' as const },
              buttonItem('See top betting sites', '/reviews'),
              buttonItem('Contact us', '/contact-us'),
            ],
          },
        ],
      },
    ],
    meta: {
      title: 'About Us | SouthAfricanBet.co.za',
      description:
        "Meet the SouthAfricanBet.co.za team, our 10-point review checklist, and why South African bettors trust our independent reviews.",
    },
    slug: 'about-us',
    title: 'About Us',
    _status: 'published' as const,
  }

  const existing = await payload.find({ collection: 'pages', limit: 1, where: { slug: { equals: 'about-us' } } })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data, context: ctx })
    payload.logger.info(`Updated about-us page (id ${existing.docs[0].id})`)
  } else {
    await payload.create({ collection: 'pages', data, context: ctx })
    payload.logger.info('Created about-us page')
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
