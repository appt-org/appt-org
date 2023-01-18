import NodeCache from 'node-cache';

export enum CacheKey {
  Sitemap = 'cache-sitemap',
  SitemapPreview = 'cache-sitemap-preview',
  SiteNavigation = 'cache-site-navigation',
}

export const cache = new NodeCache({ stdTTL: 60 });
