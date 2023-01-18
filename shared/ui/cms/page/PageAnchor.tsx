import { PropsWithChildren } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { getPageAnchorId } from 'shared/utils/page-anchors';

export type PageAnchorProps = {
  text: string;
  className?: string;
};

export function PageAnchor({ text, children, className }: PropsWithChildren<PageAnchorProps>) {
  const { t } = useTranslation();
  const id = getPageAnchorId(text);
  const href = `#${id}`;
  const title = `${t('inPageNav.anchorTitle')} ${text}`;

  const anchorClasses = classNames(`text-body group`, className);

  return (
    <>
      <span id={id} className="-mt-24 pt-24" />
      <Link href={href} scroll={false}>
        <a title={title} className={anchorClasses}>
          {children}
          <span
            className="text-accent text-[1em] ml-2 opacity-0 transition-opacity duration-200 out-quint group-focus:opacity-100 group-hover:opacity-100"
            aria-hidden>
            #
          </span>
        </a>
      </Link>
    </>
  );
}
