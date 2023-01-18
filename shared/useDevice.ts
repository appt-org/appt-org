import { useEffect, useMemo, useState } from 'react';

const TABLET_MQ = '(min-width: 48rem)';
const DESKTOP_MQ = '(min-width: 64rem)';

/**
 * Hook to get current screenWidth and if on mobile breakpoint. Use client-side only as this does not work in SSR.
 */
export function useDevice() {
  const [screenWidth, setScreenWidth] = useState<number | undefined>();
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const hasDevice = useMemo(() => screenWidth !== undefined, [screenWidth]);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    setIsTablet(window.matchMedia(TABLET_MQ).matches);
    setIsDesktop(window.matchMedia(DESKTOP_MQ).matches);
  }, [screenWidth]);

  return {
    screenWidth,
    isTablet,
    isDesktop,
    hasDevice,
  };
}
