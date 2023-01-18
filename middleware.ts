import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

// https://nextjs.org/docs/advanced-features/i18n-routing#prefixing-the-default-locale
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/_next')) {
    return undefined;
  }

  const shouldPrefixLocale =
    !PUBLIC_FILE.test(req.nextUrl.pathname) &&
    !req.nextUrl.pathname.includes('/api/') &&
    req.nextUrl.locale === 'default';

  if (shouldPrefixLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${req.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }

  return undefined;
}
