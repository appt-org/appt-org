import { createContext, PropsWithChildren, useContext } from 'react';
import { Page, SiteNavigationApiModel } from 'shared/api/api-types';
import { Breadcrumb } from 'shared/api/sitemap-api';

export type LayoutType = {
  page?: Page;
  siteNavigation: SiteNavigationApiModel;
  breadcrumbs?: Breadcrumb[];
};

type LayoutContext = {
  layout: LayoutType;
};

const LayoutContext = createContext<LayoutContext | null>(null);

export function useLayout() {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error('useLayout needs to be wrapped in LayoutProvider.');
  }

  const hasContentNavigation = !!context.layout.page?.layout?.contentNavigation;
  const hasSideNavigation = hasContentNavigation || !!context.layout?.page?.layout?.inPageNavigation;

  return {
    ...context,
    hasContentNavigation,
    hasSideNavigation,
  };
}

export function LayoutProvider({ children, layout }: PropsWithChildren<LayoutContext>) {
  return <LayoutContext.Provider value={{ layout }}>{children}</LayoutContext.Provider>;
}
