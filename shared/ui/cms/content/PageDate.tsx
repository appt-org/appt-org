import { useRouter } from 'next/router';

import { Typography } from 'shared/ui/component-library';
import { localesWithTerritory } from 'shared/utils/locale';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';

import classNames from 'classnames';

export type PageDateProps = {
  createdAt: string;
  updatedAt?: string;
  className?: string;
};

function getPageDate(locale: LOCALE_CODE, createdAt: string, updatedAt?: string): string {
  return new Date(updatedAt ?? createdAt).toLocaleDateString(localesWithTerritory[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function PageDate({ createdAt, updatedAt, className }: PageDateProps) {
  const router = useRouter();

  const classes = classNames('pt-4', className);

  return (
    <Typography className={classes} tag="p" size="heading-xs">
      {getPageDate(router.locale as LOCALE_CODE, createdAt, updatedAt)}
    </Typography>
  );
}
