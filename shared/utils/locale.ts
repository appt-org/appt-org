import { CONTENTFUL_DEFAULT_LOCALE_CODE, LOCALE_CODE } from 'shared/api/contentful/contentful-types';

export const DEFAULT_LOCALE: CONTENTFUL_DEFAULT_LOCALE_CODE = 'en';

export const locales: LOCALE_CODE[] = [DEFAULT_LOCALE, 'nl'];
export const otherLocales: LOCALE_CODE[] = locales.filter(locale => locale !== DEFAULT_LOCALE);

export const localesWithTerritory: Record<LOCALE_CODE, string> = {
  en: 'en-US',
  nl: 'nl-NL',
};

// We need to convert 'default' to 'en' to make sure the correct contentful locale is used.
export const getLocale = (locale: string | undefined) => {
  return locale === 'default' ? ('en' as LOCALE_CODE) : (locale as LOCALE_CODE);
};
