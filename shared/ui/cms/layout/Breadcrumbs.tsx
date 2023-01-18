import { ArrowDownIcon } from 'icons/index';
import { useTranslation } from 'next-i18next';
import { Breadcrumb } from 'shared/api/sitemap-api';
import { Link } from 'shared/ui/component-library';
import { logEvent } from 'shared/utils/analytics-utils';
import classNames from 'classnames';

export type BreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
};

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  const { t } = useTranslation();

  function onLinkClick(breadcrumb: Breadcrumb) {
    logEvent({
      event: 'menu_click',
      menu_name: 'breadcrumbs',
      menu_item_name: breadcrumb.title,
      menu_item_url: breadcrumb.path,
    });
  }

  const listItemClasses = classNames('inline');
  const iconClasses = classNames('w-5 h-5 -rotate-90 -translate-y-[1px] inline');

  return (
    <nav aria-label={t('breadcrumbs.label')}>
      <ol className="flex pb-4 pt-0 flex-wrap">
        <li className={listItemClasses}>
          <Link href="/">{t('breadcrumbs.home')}</Link>
          <ArrowDownIcon className={iconClasses} aria-hidden />
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.title + index} className={listItemClasses}>
            <Link
              href={breadcrumb.path}
              active={breadcrumb.current}
              aria-current={breadcrumb.current ? 'page' : undefined}
              onClick={() => onLinkClick(breadcrumb)}>
              {breadcrumb.title}
            </Link>
            {index < breadcrumbs.length - 1 && <ArrowDownIcon className={iconClasses} aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
