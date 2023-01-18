import { KeyboardEvent, PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

import { CFLink } from 'shared/ui/cms/content';
import { SkipToContent, Button, List, ExpandableNavigation } from 'shared/ui/component-library';
import { LocaleToggle } from 'shared/ui/cms/layout';
import { MenuIcon } from 'icons/index';
import { LinkApiModel, SiteNavigationApiModel } from 'shared/api/api-types';
import { useRoute } from 'shared/useRoute';
import { useDevice } from 'shared/useDevice';
import { logEvent } from 'shared/utils/analytics-utils';

export type HeaderProps = {
  siteNavigation: SiteNavigationApiModel;
};

export function Header({ children, siteNavigation }: PropsWithChildren<HeaderProps>) {
  const { t } = useTranslation();
  const { isDesktop, hasDevice } = useDevice();
  const { path } = useRoute();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const headerClassName = classNames('bg-surface sticky top-0 z-10 md:z-30', { 'shadow-md': !children });

  function toggle() {
    setShowMobileMenu(!showMobileMenu);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (showMobileMenu && e.key === 'Escape') {
      setShowMobileMenu(false);
    }
  }

  function onLinkClick(link: LinkApiModel) {
    setShowMobileMenu(false);
    logEvent({
      event: 'menu_click',
      menu_name: 'header_menu',
      menu_item_name: link.title,
      menu_item_url: link.page?.url || link.externalUrl,
    });
  }

  useEffect(() => {
    if (showMobileMenu && isDesktop) {
      setShowMobileMenu(false);
    }
  }, [showMobileMenu, isDesktop]);

  return (
    <>
      <header className={headerClassName}>
        <SkipToContent />
        <div className="flex justify-between items-center bg-surface max-w-xl mx-auto px-4 py-3 h-16 lg:px-8">
          <div className="flex items-center">
            <CFLink
              showAsLink
              link={siteNavigation.logoLink}
              image
              imageProps={{
                priority: true,
                sizes: '6rem',
                className: 'w-24 h-12',
                width: 96,
                height: 48,
                'aria-label': 'Appt',
              }}
              prefetch={true}
            />
          </div>
          <nav role="navigation" className="flex items-center" aria-label={t('primaryNav')}>
            <Button
              className="lg:hidden"
              onClick={toggle}
              aria-expanded={showMobileMenu}
              aria-controls="main-nav"
              aria-label={t('openPrimaryNav')}>
              <MenuIcon className="w-8 h-8" />
            </Button>

            <ExpandableNavigation
              open={showMobileMenu}
              toggle={toggle}
              onKeyDown={onKeyDown}
              alignment="right"
              breakpoint="lg"
              closeButtonLabel={t('closePrimaryNav')}
              show={!hasDevice || isDesktop}>
              <div className="flex flex-col items-center p-4 lg:flex-row lg:p-0">
                <List className="flex flex-col self-stretch order-2 lg:order-1 lg:flex-row" id="main-nav">
                  {siteNavigation.mainNavigationLinks.map((link, index) => (
                    <li
                      key={link.title + index}
                      className="border-b border-onsurface last:border-b-0 lg:mr-8 lg:self-center lg:border-none">
                      <CFLink
                        showAsLink
                        className="-mx-4 p-4 lg:p-0 lg:inline lg:m-0"
                        displayClass="block"
                        link={link}
                        prefetch={true}
                        active={path === link.page?.url}
                        onClick={() => onLinkClick(link)}
                      />
                    </li>
                  ))}
                </List>
                <LocaleToggle className="order-1 self-stretch lg:order-2 mb-4 lg:mb-0" backgroundClass="bg-onsurface" />
              </div>
            </ExpandableNavigation>
          </nav>
        </div>
      </header>
      {children && (
        <div role="region" className="shadow-md bg-surface">
          <div className="flex items-center  max-w-xl mx-auto px-4 lg:px-8">{children}</div>
        </div>
      )}
    </>
  );
}
