import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Header, ContentNavigation, InPageNavigation, Footer, Breadcrumbs, Hero } from 'shared/ui/cms/layout';
import { LayoutProvider, LayoutType } from 'shared/ui/cms/layout/LayoutContext';

export type LayoutProps = {
  layout: LayoutType;
};

export function Layout({ children, layout }: PropsWithChildren<LayoutProps>) {
  const hasContentNavigation = !!layout.page?.layout?.contentNavigation;
  const hasInPageNavigation = !!layout.page?.layout?.inPageNavigation;
  const hasSideNavigation = hasContentNavigation || hasInPageNavigation;

  const containerClasses = classNames('mx-auto px-4 sm:px-8', {
    'flex flex-col md:flex-row': hasSideNavigation,
    'max-w-md': !hasSideNavigation,
    'max-w-lg': hasInPageNavigation && !hasContentNavigation,
    'max-w-xl': hasContentNavigation,
  });

  return (
    <LayoutProvider layout={layout}>
      <div className="bg-background">
        <Header siteNavigation={layout.siteNavigation}>
          {layout.page && 'hero' in layout.page && !!layout.page.hero && (
            <Hero
              title={layout.page.hero.title || layout.page.title}
              introText={layout.page.hero.introText}
              image={layout.page.hero.useThumbnail ? layout.page.thumbnail : layout.page.hero.image}
            />
          )}
        </Header>
        <div className={containerClasses}>
          {layout.page?.layout?.contentNavigation && (
            <div className="md:basis-64 md:flex-none md:pl-0 md:mr-8 lg:mr-12 lg:basis-80">
              <ContentNavigation navigation={layout.page.layout.contentNavigation} />
            </div>
          )}
          {layout.page?.layout?.inPageNavigation && (
            <InPageNavigation multipleNavigationsLayout={hasContentNavigation} page={layout.page} />
          )}
          <main
            id="content"
            tabIndex={-1}
            className="flex-auto py-6 sm:py-12 overflow-hidden"
            lang={layout.page?.locale}>
            {layout.breadcrumbs?.length && <Breadcrumbs breadcrumbs={layout.breadcrumbs} />}
            {children}
          </main>
        </div>
        <Footer siteNavigation={layout.siteNavigation} />
      </div>
    </LayoutProvider>
  );
}
