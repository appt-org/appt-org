import { getFlatSitemap } from 'shared/api/sitemap-api';
import { NextApiRequest, NextApiResponse } from 'next';
import { DEFAULT_LOCALE, otherLocales } from 'shared/utils/locale';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';

type SitemapItemsByLocale = Record<string, Record<LOCALE_CODE, SitemapItem>>;

type SitemapItem = {
  path: string;
  publishedAt: string;
  locale: LOCALE_CODE;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function generateSitemapXMLLink(item: SitemapItem, locale: LOCALE_CODE) {
  return item
    ? `<xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}${
        item.path === `/${locale}` ? '' : `/${locale}`
      }${item.path}" />`
    : '';
}

function generateSitemapXMLUrl(localeItems: Record<LOCALE_CODE, SitemapItem>) {
  const item = localeItems[DEFAULT_LOCALE];

  return `<url>
       <loc>${BASE_URL}${item.path === `/${DEFAULT_LOCALE}` ? '' : `/${DEFAULT_LOCALE}`}${item.path}</loc>
       <lastmod>${item.publishedAt}</lastmod>
       ${otherLocales.map(locale => generateSitemapXMLLink(localeItems[locale], locale))}
    </url>
    `;
}

function generateSitemapXML(items: SitemapItemsByLocale) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
     ${Object.values(items)
       .map(localeItems => generateSitemapXMLUrl(localeItems))
       .join('')}
   </urlset>
 `;
}

export default async function sitemap(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = await getFlatSitemap();
  // Map flat sitemap object to a data structure object consisting of unique pages by locale.
  // This structure is needed to render the XML file according to https://developers.google.com/search/docs/advanced/crawling/localized-versions
  const sitemapItems = Object.entries(sitemap).reduce((items: SitemapItemsByLocale, [path, item]) => {
    items[item.id] = {
      ...items[item.id],
      [item.locale]: {
        path,
        publishedAt: item.publishedAt,
        locale: item.locale,
      },
    };
    return items;
  }, {});

  const sitemapXML = generateSitemapXML(sitemapItems);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapXML);
  res.end();
}
