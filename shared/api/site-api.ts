import { getEntry } from 'shared/api/contentful/contentful-api';
import { ISiteNavigation, LOCALE_CODE } from 'shared/api/contentful/contentful-types';
import { mapSiteNavigation } from 'shared/api/contentful/contentful-mapper';
import { cache, CacheKey } from 'shared/api/cache-service';
import { SiteNavigationApiModel } from 'shared/api/api-types';

export async function getSiteNavigation(locale?: LOCALE_CODE, preview?: boolean) {
  const cacheKey = `${CacheKey.SiteNavigation}-${locale}`;
  let navigation: SiteNavigationApiModel | undefined = preview ? undefined : cache.get(cacheKey);

  if (!navigation) {
    const response = await getEntry<ISiteNavigation>({ content_type: 'siteNavigation', locale, preview, include: 2 });

    if (!response) {
      throw new Error('Failed to fetch site navigation from Contentful.');
    }

    navigation = await mapSiteNavigation(response.entry);
  }

  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, navigation);
  }

  return navigation;
}
