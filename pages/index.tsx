import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { PageHandler } from 'shared/ui/cms/page';
import { getHomePage } from 'shared/api/page-api';
import { HomePageApiModel, SiteNavigationApiModel } from 'shared/api/api-types';
import { getSiteNavigation } from 'shared/api/site-api';
import { getLocale } from 'shared/utils/locale';

type Props = {
  page: HomePageApiModel;
  siteNavigation: SiteNavigationApiModel;
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale, preview }) => {
  const contentfulLocale = getLocale(locale);
  const [page, siteNavigation] = await Promise.all([
    getHomePage(contentfulLocale, preview),
    getSiteNavigation(contentfulLocale, preview),
  ]);

  return {
    revalidate: 60,
    props: {
      ...(await serverSideTranslations(contentfulLocale, ['common'])),
      page,
      siteNavigation,
    },
  };
};

export default function Index({ page, siteNavigation }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <PageHandler page={page} layout={{ page, siteNavigation }} />;
}
