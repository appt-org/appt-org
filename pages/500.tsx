import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SiteNavigationApiModel } from 'shared/api/api-types';
import { getSiteNavigation } from 'shared/api/site-api';
import { Layout } from 'shared/ui/cms/layout';
import { getLocale } from 'shared/utils/locale';
import { Typography } from 'shared/ui/component-library';

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

export default function Unhandled({ siteNavigation }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  return (
    <Layout layout={{ siteNavigation }}>
      <article className="flex flex-col items-center text-center my-16">
        <Typography tag="h1" size="heading-xl">
          {t('serverError.title')}
        </Typography>
        <Typography className="mt-4" tag="p" size="paragraph">
          {t('serverError.text')}
        </Typography>
      </article>
    </Layout>
  );
}
