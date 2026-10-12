import type { Metadata } from 'next'

export const SITE_URL = 'https://market.suedeai.ai'
const ORG_ID = 'https://suedeai.ai/#organization'
const FOUNDER_ID = 'https://suedeai.ai/founder#person'
const WEBSITE_ID = `${SITE_URL}/#website`

// 1200x630 crop of the studio photograph the hero uses, served from this host.
const SHARE_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'Wall-mounted guitars and a mixing console in a recording studio',
}

export function createPublicPageMetadata({
  path,
  title,
  description,
}: {
  path: string
  title: string
  description: string
}): Metadata {
  const url = new URL(path, SITE_URL).toString()

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'suedeMarket',
      title,
      description,
      url,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }],
    },
  }
}

/**
 * The shared Suede AI Organization, stated the same way as on suedeai.ai so
 * search engines merge it with the canonical node rather than a rival copy.
 */
const organizationNode = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Suede AI',
  alternateName: ['Suede Labs', 'Suede Labs AI'],
  url: 'https://suedeai.ai',
  foundingDate: '2024',
  founder: { '@id': FOUNDER_ID },
}

function breadcrumb(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'suedeMarket', path: '/' }, ...trail].map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, SITE_URL).toString(),
    })),
  }
}

function pageImage() {
  return { '@type': 'ImageObject', url: SHARE_IMAGE.url, width: SHARE_IMAGE.width, height: SHARE_IMAGE.height }
}

/** JSON-LD for the home page: the WebSite, the page itself and the publisher. */
export function homeJsonLd({ title, description }: { title: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: 'suedeMarket',
        alternateName: 'Suede AI Musical Instrument Marketplace',
        description,
        inLanguage: 'en-US',
        publisher: { '@id': ORG_ID },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/listings?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: title,
        description,
        inLanguage: 'en-US',
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORG_ID },
        primaryImageOfPage: pageImage(),
      },
      organizationNode,
    ],
  }
}

/** JSON-LD for a public collection page below the home page. */
export function collectionJsonLd({
  path,
  title,
  description,
  crumb,
}: {
  path: string
  title: string
  description: string
  crumb: string
}) {
  const url = new URL(path, SITE_URL).toString()
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: 'en-US',
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORG_ID },
        primaryImageOfPage: pageImage(),
        breadcrumb: breadcrumb([{ name: crumb, path }]),
      },
      organizationNode,
    ],
  }
}

/** Serialise JSON-LD for a <script> tag, escaping "<" so it cannot close the tag. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') }
}
