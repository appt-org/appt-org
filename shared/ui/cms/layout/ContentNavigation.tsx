import { KeyboardEvent, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { ContentNavigationItem } from 'shared/ui/cms/layout';
import { Button, List, ExpandableNavigation } from 'shared/ui/component-library';
import { EllipsisVerticalIcon } from 'icons/index';
import { ContentNavigationApiModel } from 'shared/api/api-types';
import { useDevice } from 'shared/useDevice';

export type ContentNavigationProps = {
  navigation: ContentNavigationApiModel;
};

export function ContentNavigation({ navigation }: ContentNavigationProps) {
  const { t } = useTranslation();
  const { isTablet, hasDevice } = useDevice();
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (open && e.key === 'Escape') {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (open && isTablet) {
      setOpen(false);
    }
  }, [open, isTablet]);

  return (
    <nav className="h-full" role="navigation" aria-label={t('sidebar.nav')}>
      <Button
        className="self-start mt-4 md:hidden"
        color="surface"
        size="small"
        onClick={toggle}
        aria-label={t('sidebar.openNavLabel')}
        aria-controls="sidebar-nav"
        aria-expanded={open}>
        <EllipsisVerticalIcon className="w-8 h-8" />
      </Button>

      <ExpandableNavigation
        open={open}
        onKeyDown={onKeyDown}
        toggle={toggle}
        alignment="left"
        breakpoint="md"
        closeButtonLabel={t('sidebar.closeNavLabel')}
        show={!hasDevice || isTablet}>
        <List
          id="sidebar-nav"
          className="scrollbar-hide flex flex-col sticky w-[20rem] h-[calc(100vh-4.5rem)] top-[4.5rem] overflow-auto max-h-[calc(100vh-4.5rem)] max-w-[100vw] pr-2 md:h-auto md:w-auto md:pr-0 md:py-8">
          {navigation.navigationItems.map((item, index) => (
            <ContentNavigationItem
              key={index}
              item={item}
              className="mt-2 first:mt-0 sm:mt-4"
              onClick={() => setOpen(false)}
            />
          ))}
        </List>
      </ExpandableNavigation>
    </nav>
  );
}
