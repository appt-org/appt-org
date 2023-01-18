import { NextApiRequest, NextApiResponse } from 'next';
import { getFlatSitemap, getSitemapItemById } from 'shared/api/sitemap-api';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';

export default async function locale(req: NextApiRequest, res: NextApiResponse) {
  const { url, newLocale } = req.query;
  const fallbackRedirectUrl = `/${newLocale}`;

  if (!url || typeof url !== 'string' || !newLocale || typeof newLocale !== 'string') {
    return res.redirect(fallbackRedirectUrl);
  }

  // Home page
  if (url === '/') {
    return res.redirect(fallbackRedirectUrl);
  }

  const sitemap = await getFlatSitemap();
  const currentSitemapItem = sitemap[url];

  if (!currentSitemapItem) {
    return res.redirect(fallbackRedirectUrl);
  }

  const newSitemapItem = await getSitemapItemById(currentSitemapItem.id, newLocale as LOCALE_CODE);

  if (!newSitemapItem) {
    return res.redirect(fallbackRedirectUrl);
  }

  const newUrl = newSitemapItem.path;

  res.redirect(`/${newLocale}${newUrl.replace(`/${newLocale}/`, '/')}`);
}
