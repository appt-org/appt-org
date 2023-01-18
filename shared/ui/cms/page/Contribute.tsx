import { useTranslation } from 'next-i18next';
import { LinkAppearance } from 'shared/api/api-types';
import { Link, Typography } from 'shared/ui/component-library';
import { ExternalIcon } from 'icons/index';

export function Contribute() {
  const { t } = useTranslation();
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL as string;

  return (
    <section className="bg-surface shadow-md p-16 flex items-center flex-col">
      <Typography className="text-center mb-8" tag="h2" size="heading-m">
        {t('contribute.text')}
      </Typography>
      <Link
        href={feedbackUrl}
        appearance={LinkAppearance.PrimaryButton}
        icon={
          <ExternalIcon
            aria-label={t('externalLinkLabel')}
            className="w-8 h-8 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        }>
        {t('contribute.button')}
      </Link>
    </section>
  );
}
