import { PropsWithChildren } from 'react';
import { useTranslation } from 'next-i18next';

import { LinkApiModel, SiteNavigationApiModel } from 'shared/api/api-types';
import { CFLink, RichText } from 'shared/ui/cms/content';
import { Typography } from 'shared/ui/component-library';
import { logEvent } from 'shared/utils/analytics-utils';

import { FooterLinkList } from 'shared/ui/cms/layout/FooterLinkList';
import { FooterLogoLinkList } from 'shared/ui/cms/layout/FooterLogoLinkList';

export type FooterProps = {
  siteNavigation: SiteNavigationApiModel;
};

export function Footer({ siteNavigation }: PropsWithChildren<FooterProps>) {
  const { t } = useTranslation();

  const year = new Date().getFullYear();

  function onLinkClick(link: LinkApiModel) {
    logEvent({
      event: 'menu_click',
      menu_name: 'footer_menu',
      menu_item_name: link.title,
      menu_item_url: link.page?.url || link.externalUrl,
    });
  }

  return (
    <footer className="bg-surface">
      <div className="max-w-xl mx-auto p-8 sm:p-16">
        <CFLink
          showAsLink
          link={siteNavigation.logoLink}
          image
          imageProps={{
            className: 'w-24 h-12',
            sizes: '6rem',
            width: 96,
            height: 48,
            priority: true,
          }}
        />
        <div className="flex flex-col gap-8 xl:flex-row">
          <div className="flex flex-col basis-6/12 mr-4">
            {siteNavigation.footerText && <RichText text={siteNavigation.footerText} />}
          </div>

          <div className="flex flex-col flex-1 gap-8 sm:flex-row">
            <div className="flex flex-col flex-1 justify-between gap-8 xs:flex-row">
              {siteNavigation.mainNavigationLinks && (
                <FooterLinkList links={siteNavigation.mainNavigationLinks} onClick={onLinkClick} />
              )}
              {siteNavigation.footerNavigationLinks && (
                <FooterLinkList links={siteNavigation.footerNavigationLinks} onClick={onLinkClick} />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-8">
              {siteNavigation.footerPartnerLogos && (
                <FooterLogoLinkList
                  links={siteNavigation.footerPartnerLogos}
                  label={t('footer.partnerLogosText')}
                  onClick={onLinkClick}
                />
              )}
              {siteNavigation.footerSponsorLogos && (
                <FooterLogoLinkList
                  links={siteNavigation.footerSponsorLogos}
                  label={t('footer.sponsorLogosText')}
                  onClick={onLinkClick}
                  small
                />
              )}
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-onsurface my-8" />
        <Typography className="text-center mx-auto">
          © {year} {t('footer.copyrightText')}
        </Typography>
      </div>
    </footer>
  );
}
