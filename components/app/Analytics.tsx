import { useEffect, useState } from 'react';
import _throttle from 'lodash/throttle';
import Script from 'next/script';
import Router from 'next/router';
import { logEvent } from 'shared/utils/analytics-utils';

type ScrollPercentage = 25 | 50 | 75 | 90;

const SCROLL_PERCENTAGES: ScrollPercentage[] = [25, 50, 75, 90];

export default function Analytics() {
  const [pageInitialized, setPageInitialized] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrollPercentages, setScrollPercentages] = useState<ScrollPercentage[]>([]);

  useEffect(() => {
    const newScrollPercentages: ScrollPercentage[] = [];

    SCROLL_PERCENTAGES.forEach(percentage => {
      if (scrollPercentage >= percentage && scrollPercentages.indexOf(percentage) === -1) {
        newScrollPercentages.push(percentage);
        logEvent({ event: 'scroll', scroll_percentage: percentage });
      }
    });

    if (newScrollPercentages.length) {
      setScrollPercentages([...scrollPercentages, ...newScrollPercentages]);
    }
  }, [scrollPercentage, scrollPercentages]);

  useEffect(() => {
    const debouncedScrollHandler = _throttle(handleScroll, 250);

    function resetState() {
      if (pageInitialized && scrollPercentages.length) {
        setScrollPercentages([]);
      }

      if (!pageInitialized) {
        setPageInitialized(true);
      }
    }

    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const newScrollPercentage = (scrollTop / scrollHeight) * 100;

      setScrollPercentage(newScrollPercentage);
    }

    Router.events.on('routeChangeComplete', resetState);
    Router.events.on('routeChangeError', resetState);

    window.addEventListener('scroll', debouncedScrollHandler);

    return () => {
      Router.events.off('routeChangeComplete', resetState);
      Router.events.off('routeChangeError', resetState);

      window.removeEventListener('scroll', debouncedScrollHandler);
      debouncedScrollHandler?.cancel();
    };
  }, [pageInitialized, scrollPercentages]);

  return (
    <>
      <Script id="google-analytics">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          '${process.env.NEXT_PUBLIC_ANALYTICS_SERVER_URL}/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_ANALYTICS_GTM_ID}');
        `}
      </Script>
    </>
  );
}
