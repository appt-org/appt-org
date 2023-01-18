import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getPageById } from 'shared/api/page-api';
import { Page, SiteNavigationApiModel } from 'shared/api/api-types';
import { PageHandler } from 'shared/ui/cms/page';
import { Breadcrumb, getBreadcrumbs, getFlatSitemap } from 'shared/api/sitemap-api';
import { getSiteNavigation } from 'shared/api/site-api';
import { getLocale } from 'shared/utils/locale';

type Props = {
  page: Page;
  siteNavigation: SiteNavigationApiModel;
  breadcrumbs: Breadcrumb[];
};

export const getStaticProps: GetStaticProps<Props> = async ({ params, locale, preview }) => {
  const path = params?.slug ? `/${(params.slug as string[]).join('/')}` : '/';
  const sitemap = await getFlatSitemap(preview);
  const sitemapPage = sitemap[path];
  const contentfulLocale = getLocale(locale);

  if (!sitemapPage) {
    return {
      notFound: true,
    };
  }

  const [page, siteNavigation] = await Promise.all([
    getPageById(sitemapPage.id, contentfulLocale, preview),
    getSiteNavigation(contentfulLocale, preview),
  ]);

  if (!page) {
    return {
      notFound: true,
    };
  }

  const breadcrumbs = await getBreadcrumbs(page.id, contentfulLocale);

  return {
    revalidate: 300,
    props: {
      ...(await serverSideTranslations(contentfulLocale, ['common'])),
      page,
      siteNavigation,
      breadcrumbs,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default function Index({ page, breadcrumbs, siteNavigation }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <PageHandler page={page} layout={{ page, siteNavigation, breadcrumbs }} />;
}
