import { PropsWithChildren } from 'react';
import Head from 'next/head';
import { NextSeo } from 'next-seo';
import { useTheme } from 'next-themes';

import { Page } from 'shared/api/api-types';
import { localesWithTerritory } from 'shared/utils/locale';
import { isProd } from 'shared/utils/env';
import { useRoute } from 'shared/useRoute';

export type PageMetaProps = {
  page: Page;
};

export function PageMeta({ page }: PropsWithChildren<PageMetaProps>) {
  const { pathWithLocale } = useRoute();
  const { resolvedTheme } = useTheme();

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${pathWithLocale}`;

  return (
    <>
      <Head>
        <meta name="theme-color" content={resolvedTheme === 'dark' ? '#202020' : '#ffffff'} />
      </Head>
      <NextSeo
        title={page.seo?.title || page.title}
        titleTemplate={page.type !== 'pageHomePage' ? '%s — Appt' : '%s'}
        defaultTitle="Appt"
        canonical={url}
        description={page.seo?.description}
        noindex={!isProd() ? true : page.seo?.no_index}
        nofollow={!isProd() ? true : page.seo?.no_follow}
        openGraph={{
          url,
          site_name: 'Appt',
          title: page.seo?.title,
          description: page.seo?.description,
          locale: localesWithTerritory[page.locale],
          article: {
            publishedTime: page.createdAt,
            modifiedTime: page.updatedAt,
          },
          images: page.thumbnail
            ? [
                {
                  url: `https:${page.thumbnail.lightAsset.url}`,
                  alt: page.thumbnail.lightAsset.alt,
                  width: page.thumbnail.lightAsset.width,
                  height: page.thumbnail.lightAsset.height,
                },
              ]
            : [
                {
                  url: `${process.env.NEXT_PUBLIC_BASE_URL}/share.png`,
                  alt: 'Appt logo on light background with subtitle empowering developers to build accessible apps for everyone',
                  width: 1200,
                  height: 630,
                },
              ],
          type: 'article',
        }}
      />
    </>
  );
}
