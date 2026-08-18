import type { Metadata } from 'next'
import { Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ClientProviders } from './providers'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://av-team.digital'),
  title: {
    default: 'AV Team — Digital Agency & Technology Studio',
    template: '%s | AV Team',
  },
  description:
    'AV Team — digital agency и technology studio полного цикла. Создаём сайты, CRM, SaaS, AI-системы и Enterprise-платформы под ключ.',
  keywords: [
    'AV Team',
    'digital agency',
    'веб-студия',
    'разработка сайтов',
    'создание CRM',
    'SaaS разработка',
    'AI автоматизация',
    'Enterprise архитектура',
  ],
  authors: [{ name: 'AV Team', url: 'https://av-team.digital' }],
  creator: 'AV Team',
  publisher: 'AV Team',
  alternates: {
    canonical: 'https://av-team.digital',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://av-team.digital',
    title: 'AV Team — Digital Agency & Technology Studio',
    description:
      'Создаём и развиваем сайты, CRM, SaaS и AI-системы под ключ. Одна команда — весь digital-контур бизнеса.',
    siteName: 'AV Team',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AV Team — Digital Agency & Technology Studio',
    description:
      'Создаём и развиваем сайты, CRM, SaaS и AI-системы под ключ. Одна команда — весь digital-контур бизнеса.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://av-team.digital/#organization',
      name: 'AV Team',
      url: 'https://av-team.digital',
      logo: 'https://av-team.digital/logo.png',
      description: 'Digital agency & technology studio полного цикла',
      sameAs: ['https://t.me/av_digital_studio'],
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://av-team.digital/#service',
      name: 'AV Team Digital Services',
      url: 'https://av-team.digital',
      priceRange: '$$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'RU',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Digital Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Web & E-commerce Development',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'CRM & Business Systems',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'SaaS & Product Engineering',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI & Business Automation',
            },
          },
        ],
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
