import { FormEvent } from 'react';
import { useRouter } from 'next/router';

import { locales } from 'shared/utils/locale';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';
import { Select } from 'shared/ui/component-library';
import { useTranslation } from 'next-i18next';
import { useRoute } from 'shared/useRoute';
import { logEvent } from 'shared/utils/analytics-utils';

export type LocaleToggleProps = {
  className?: string;
  backgroundClass?: string;
};

export function LocaleToggle({ className, backgroundClass }: LocaleToggleProps) {
  const router = useRouter();
  const { path } = useRoute();
  const { t } = useTranslation();

  const localeStrings: Record<LOCALE_CODE, string> = {
    en: 'English',
    nl: 'Nederlands',
  };

  const options = locales.map(locale => {
    return { value: locale, displayName: localeStrings[locale], lang: locale };
  });

  function changeLocale(e: FormEvent<HTMLSelectElement>) {
    const newLocale = (e.target as HTMLSelectElement).value;
    const newUrl = `/api/locale?url=${path}&newLocale=${newLocale}`;

    logEvent({ event: 'language_switch', language_new: newLocale, language_old: router.locale });

    window.history.pushState({}, '', newUrl);
    window.location.replace(newUrl);
  }

  return (
    <Select
      id="locale-toggle"
      accessibilityLabel={t('localeSelectLabel')}
      onChange={changeLocale}
      defaultValue={router.locale}
      options={options}
      className={className}
      backgroundClass={backgroundClass}
    />
  );
}
