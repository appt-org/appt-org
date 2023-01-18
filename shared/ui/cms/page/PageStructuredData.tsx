import { Breadcrumb } from '../../../api/sitemap-api';
import Script from 'next/script';

export type PageStructuredDataProps = {
  breadcrumbs?: Breadcrumb[];
};

export function PageStructuredData({ breadcrumbs }: PageStructuredDataProps) {
  if (!breadcrumbs) return null;

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.title,
        item: `${process.env.NEXT_PUBLIC_BASE_URL}${breadcrumb.path}`,
      };
    }),
  };

  return (
    <Script
      id="structured-data-script"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}
