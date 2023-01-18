import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import { ThemeProvider } from 'next-themes';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import { useRoute } from 'shared/useRoute';

import PageLoader from 'components/app/PageLoader';
import Analytics from 'components/app/Analytics';
import { PlatformProvider } from 'components/app/PlatformProvider';
import { analyticsEnabled } from 'shared/utils/env';

import '../styles/globals.css';
import 'styles/prism/a11y-light.css';
import 'styles/prism/a11y-dark.css';
import { BasePageApiModel } from 'shared/api/api-types';

type FloatingFocus = any;
type MyAppProps = {
  page?: BasePageApiModel;
} & SSRConfig;

let floatingFocusInstance: FloatingFocus;

function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  const [loadingPage, setLoadingPage] = useState(false);
  const { path } = useRoute();

  useEffect(() => {
    async function initFloatingFocus() {
      const FloatingFocus = (await import('@q42/floating-focus-a11y')).default;
      floatingFocusInstance = new FloatingFocus();
    }

    if (!floatingFocusInstance) {
      initFloatingFocus();
    }

    Router.events.on('routeChangeStart', () => setLoadingPage(true));
    Router.events.on('routeChangeComplete', () => setLoadingPage(false));
    Router.events.on('routeChangeError', () => setLoadingPage(false));

    return () => {
      Router.events.off('routeChangeStart', () => setLoadingPage(true));
      Router.events.off('routeChangeComplete', () => setLoadingPage(false));
      Router.events.off('routeChangeError', () => setLoadingPage(false));
    };
  }, []);

  return (
    <>
      {analyticsEnabled() && <Analytics />}
      <ThemeProvider attribute="class">
        <PlatformProvider platformFilter={pageProps.page?.platformFilter}>
          {/* 
          If we don't set a key here, some components on the page won't get rerendered.
          This results in useEffects not getting triggered on first load & possibly some old state,
          so components won't load correctly.
         */}
          <Component {...pageProps} key={path} />
          <PageLoader loading={loadingPage} />
        </PlatformProvider>
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
