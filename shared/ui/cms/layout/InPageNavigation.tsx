import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

import { Typography, Anchor, List } from 'shared/ui/component-library';
import { Page } from 'shared/api/api-types';
import { PageAnchor } from 'shared/utils/page-anchors';
import { getPageAnchors } from 'shared/ui/cms/layout/in-page-navigation-utils';
import { logEvent } from 'shared/utils/analytics-utils';
import { useRoute } from 'shared/useRoute';

export type InPageNavigationProps = {
  page: Page;
  multipleNavigationsLayout: boolean;
};

export function InPageNavigation({ page, multipleNavigationsLayout }: InPageNavigationProps) {
  const { t } = useTranslation();
  const { pathWithLocale } = useRoute();
  const [pageAnchors, setPageAnchors] = useState<PageAnchor[]>(getPageAnchors(page, t));

  useEffect(() => {
    setPageAnchors(getPageAnchors(page, t));
  }, [page, t]);

  const classes = classNames(
    'text-body order-last basis-40 shrink-0 hidden ml-8 lg:ml-12 relative',
    { 'xl:block': multipleNavigationsLayout },
    { 'md:block': !multipleNavigationsLayout },
  );

  function onAnchorClick(anchor: PageAnchor) {
    logEvent({
      event: 'menu_click',
      menu_name: 'in_page_menu',
      menu_item_name: anchor.text,
      menu_item_url: `${pathWithLocale}#${anchor.id}`,
    });
  }

  if (pageAnchors.length === 0) {
    return null;
  }

  return (
    <aside className={classes}>
      <nav className="sticky py-12 top-[3.5rem] overflow-auto max-h-[100vh]" aria-label={t('inPageNav.ariaLabel')}>
        <Typography className="mb-4" tag="h2" size="heading-xs">
          {t('inPageNav.title')}
        </Typography>
        <List>
          {pageAnchors.map((anchor, index) => (
            <li key={anchor.id + index} className="mb-2">
              <Anchor href={`#${anchor.id}`} onClick={() => onAnchorClick(anchor)}>
                {anchor.text}
              </Anchor>
            </li>
          ))}
        </List>
      </nav>
    </aside>
  );
}
