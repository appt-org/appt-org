import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Layout } from 'shared/ui/cms/layout';
import { Typography, Link } from 'shared/ui/component-library';
import { getSiteNavigation } from 'shared/api/site-api';
import { SiteNavigationApiModel } from 'shared/api/api-types';
import { useRouter } from 'next/router';
import { getLocale } from 'shared/utils/locale';

type Props = {
  siteNavigation: SiteNavigationApiModel;
};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const siteNavigation = await getSiteNavigation();
  const contentfulLocale = getLocale(locale);

  return {
    props: {
      ...(await serverSideTranslations(contentfulLocale, ['common'])),
      siteNavigation,
    },
  };
};

export default function NotFound({ siteNavigation }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Layout layout={{ siteNavigation }}>
      <article className="flex flex-col items-center text-center my-16">
        <Typography tag="h1" size="heading-xl">
          {t('pageNotFound.title')}
        </Typography>
        <Typography className="mt-4" tag="p" size="paragraph">
          {t('pageNotFound.text')}
        </Typography>
        <Link href="/" locale={router.locale}>
          {t('pageNotFound.linkText')}
        </Link>
      </article>
    </Layout>
  );
}
