import { useRouter } from 'next/router';

export function useRoute() {
  const router = useRouter();
  const path = router.asPath.split('#')[0];
  const pathWithLocale = `/${router.locale}${path}`;

  return {
    path,
    pathWithLocale,
  };
}
