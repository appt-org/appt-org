import { useTranslation } from 'next-i18next';

export function SkipToContent() {
  const { t } = useTranslation();

  return (
    <a
      className="sr-only block text-body bg-onsurface rounded-md top-4 left-2 z-50 focus:not-sr-only focus:absolute focus:px-3 focus:py-2"
      href="#content">
      {t('skipToContent')}
    </a>
  );
}
