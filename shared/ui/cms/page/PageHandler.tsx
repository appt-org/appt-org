import dynamic from 'next/dynamic';

import { Page } from 'shared/api/api-types';
import { PageMeta, PageStructuredData } from 'shared/ui/cms/page';
import { ContentPageProps } from 'components/content/ContentPage';
import { HomePageProps } from 'components/home/HomePage';
import { GuidelinePageProps } from 'components/guideline/GuidelinePage';
import { ObjectPageProps } from 'components/object/ObjectPage';
import { LayoutType } from 'shared/ui/cms/layout/LayoutContext';

export type PageHandlerProps = {
  page: Page;
  layout: LayoutType;
};

const PageComponents = {
  HomePage: dynamic<HomePageProps>(() => import('components/home/HomePage')),
  ContentPage: dynamic<ContentPageProps>(() => import('components/content/ContentPage')),
  GuidelinePage: dynamic<GuidelinePageProps>(() => import('components/guideline/GuidelinePage')),
  ObjectPage: dynamic<ObjectPageProps>(() => import('components/object/ObjectPage')),
};

export function PageHandler({ page, layout }: PageHandlerProps) {
  return (
    <>
      <PageMeta page={page} />
      <PageStructuredData breadcrumbs={layout.breadcrumbs} />
      {renderPageComponent(page, layout)}
    </>
  );
}

function renderPageComponent(page: Page, layout: LayoutType) {
  switch (page.type) {
    case 'pageHomePage':
      return <PageComponents.HomePage page={page} layout={layout} />;
    case 'pageContentPage':
      return <PageComponents.ContentPage page={page} layout={layout} />;
    case 'pageGuidelinePage':
      return <PageComponents.GuidelinePage page={page} layout={layout} />;
    case 'pageObjectPage':
      return <PageComponents.ObjectPage page={page} layout={layout} />;
    default:
      throw new Error(`Failed to mount page of type ${page['type']}. Page component not found, make sure it exists.`);
  }
}
