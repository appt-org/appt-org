import { fetchGraphQL } from 'shared/api/contentful/contentful-graphql-api';
import { FlatSitemap, SitemapPageApiModel } from 'shared/api/api-types';
import { cache, CacheKey } from 'shared/api/cache-service';
import { DEFAULT_LOCALE, otherLocales } from 'shared/utils/locale';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';

export type Breadcrumb = {
  title: string;
  path: string;
  current: boolean;
};

type GraphQLPageItemResponse = {
  slug: string;
  title: string;
  sys: {
    id: string;
    publishedAt: string;
  };
  parent: {
    slug: string;
    sys: {
      id: string;
    };
  };
};

type PageTreeItem = {
  sys: {
    id: string;
    publishedAt: string;
  };
  slug: string;
  title: string;
  children?: PageTreeItem[];
  parent: {
    slug: string;
    sys: {
      id: string;
    };
  };
};

export async function getFlatSitemap(preview = false): Promise<FlatSitemap> {
  const cacheKey = preview ? CacheKey.SitemapPreview : CacheKey.Sitemap;
  let sitemap: FlatSitemap | undefined = cache.get(cacheKey);

  if (!sitemap) {
    for (const locale of [...otherLocales, DEFAULT_LOCALE]) {
      // TODO: Improve api call to fetch all pages. We know have to specify which page types are fetched for the sitemap.
      const parentPageQuery = `
        slug
        sys {
          id
        }
      `;
      const pageQuery = `items {
        slug
        title
        sys {
          id
          publishedAt
        }
        parent {
          ... on PageHomePage {
            sys {
              id
            }
          }
          ... on PageContentPage {
            ${parentPageQuery}
          }
          ... on PageObjectPage {
            ${parentPageQuery}
          }
          ... on PageGuidelinePage {
            ${parentPageQuery}
          }
        }
      }`;
      const response = await fetchGraphQL<any | null>(
        `
        query($locale:String, $preview: Boolean) {
          pageHomePageCollection(limit: 1, locale: $locale, preview: $preview) {
            items {
              sys {
                id
                publishedAt
              }
            }
          }
          pageContentPageCollection(limit: 2000, locale: $locale, preview: $preview) {
            ${pageQuery}
          }
          pageObjectPageCollection(limit: 1500, locale: $locale, preview: $preview) {
            ${pageQuery}
          }
          pageGuidelinePageCollection(limit: 1500, locale: $locale, preview: $preview) {
            ${pageQuery}
          }
        }
      `,
        { locale },
        preview,
      );

      if (!response) {
        throw new Error('Failed to get sitemap. Missing required home page');
      }

      const flattenedResponseItems = Object.values(response.data).reduce(
        (items: GraphQLPageItemResponse[], collection: any) => {
          items.push(...collection.items);
          return items;
        },
        [],
      );
      const tree = mapPageTree(flattenedResponseItems);
      const sitemapForLocale = mapSitemapForLocale(tree, locale);

      sitemap = { ...(sitemap || {}), ...sitemapForLocale };
    }

    if (!sitemap) {
      throw new Error('Failed to generate sitemap. Are there any locales setup?');
    }
  }

  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, sitemap);
  }

  return sitemap;
}

export async function getBreadcrumbs(pageId: string, locale: LOCALE_CODE) {
  return getBreadcrumbItems(pageId, locale, true);
}

async function getBreadcrumbItems(pageId: string, locale: LOCALE_CODE, current: boolean) {
  const breadcrumbs: Breadcrumb[] = [];
  const page = await getSitemapItemById(pageId, locale);

  if (!page) return [];

  breadcrumbs.unshift({ title: page.title, path: page.path, current });

  if (page.parent && page.parent.slug) {
    breadcrumbs.unshift(...(await getBreadcrumbItems(page.parent.sys.id, locale, false)));
  }

  return breadcrumbs;
}

export async function getSitemapItemById(id: string, locale: LOCALE_CODE, preview = false) {
  const sitemap = await getFlatSitemap(preview);
  const sitemapItems = Object.entries(sitemap)
    .filter(([_, item]) => item.id === id)
    .reduce(
      (items: Record<string, SitemapPageApiModel>, [_, item]) => ({
        ...items,
        [item.locale as LOCALE_CODE]: item,
      }),
      {},
    );

  return sitemapItems[locale] || sitemapItems[DEFAULT_LOCALE];
}

function mapPageTree(pageItems: GraphQLPageItemResponse[]) {
  const tree: PageTreeItem[] = [];
  const mappedArr: Record<string, GraphQLPageItemResponse & { children: GraphQLPageItemResponse[] }> = {};

  pageItems.forEach(item => {
    if (!mappedArr.hasOwnProperty(item.sys.id)) {
      mappedArr[item.sys.id] = {
        ...item,
        children: [],
      };
    }
  });

  Object.entries(mappedArr).forEach(([_, page]) => {
    if (page.parent) {
      mappedArr[page.parent.sys.id].children.push(page);
    } else if (page.slug === undefined) {
      tree.push(page);
    }
  });

  return tree;
}

function mapSitemapForLocale(pageTree: PageTreeItem[], locale: LOCALE_CODE = DEFAULT_LOCALE) {
  const sitemap: FlatSitemap = {};
  mapSitemapPage(sitemap, pageTree[0], locale);

  return sitemap;
}

function mapSitemapPage(sitemap: FlatSitemap, parentPage: PageTreeItem, locale: LOCALE_CODE, path = '') {
  const slug = path ? parentPage.slug : '/';
  const currentPath = `${path}${slug}`;
  const sitemapPath = `${currentPath}${path ? '' : locale}`;

  sitemap[sitemapPath] = {
    id: parentPage.sys.id,
    publishedAt: parentPage.sys.publishedAt,
    path: currentPath,
    locale,
    slug,
    title: parentPage.title,
    parent: parentPage.parent,
  };

  const newPath = `${currentPath}${path ? '/' : ''}`;

  parentPage.children?.forEach((page: any) => mapSitemapPage(sitemap, page, locale, newPath));
}
