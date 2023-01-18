import { NextApiRequest, NextApiResponse } from 'next';
import { getSitemapItemById } from 'shared/api/sitemap-api';
import { DEFAULT_LOCALE } from 'shared/utils/locale';

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  const { secret, id } = req.query;

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !id || typeof id !== 'string') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const sitemapItem = await getSitemapItemById(id, DEFAULT_LOCALE, true);

  if (!sitemapItem) {
    return res.status(404).json({ message: 'Target preview page not found' });
  }

  res.setPreviewData({});
  res.redirect(sitemapItem.path);
}
