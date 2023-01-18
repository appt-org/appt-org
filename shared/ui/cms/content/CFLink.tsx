import { ImageProps } from 'next/image';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { CFImage } from 'shared/ui/cms/content';
import { Link, LinkProps } from 'shared/ui/component-library';
import { LinkApiModel, LinkAppearance } from 'shared/api/api-types';
import { ExternalIcon } from 'icons/index';

export type CFLinkProps = {
  link: LinkApiModel;
  image?: boolean;
  showAsLink?: boolean;
  imageProps?: Omit<ImageProps, 'src' | 'onClick'>;
} & Omit<LinkProps, 'href'>;

export function CFLink({
  children,
  className,
  active,
  underline,
  link,
  image,
  title,
  onClick,
  showAsLink = false,
  displayClass,
  imageProps,
  ...linkProps
}: PropsWithChildren<CFLinkProps>) {
  const { t } = useTranslation();
  const showExternalLinkIcon = !link.page?.url && link.externalUrl && !image;
  const isButton =
    link.appearance === LinkAppearance.PrimaryButton || link.appearance === LinkAppearance.SecondaryButton;
  const iconClassNames = classNames('w-8 h-8 inline-block', {
    'absolute left-3 top-1/2 transform -translate-y-1/2': isButton,
  });

  const getHref = () => {
    const hrefLink = link.page?.url || link.externalUrl;

    if (!hrefLink) {
      return '#';
    }

    const anchor = link.anchor ? `#${link.anchor}` : '';
    return `${hrefLink}${anchor}`;
  };

  const renderLinkInner = () => {
    if (children) {
      return children;
    } else if (!isButton && link.image && image) {
      // We only show an image if link is styled as a link
      return <CFImage image={link.image} {...imageProps} />;
    } else {
      return link.title;
    }
  };

  return (
    <Link
      className={className}
      href={getHref()}
      title={title}
      target={link.targetBlank ? '_blank' : undefined}
      active={active}
      onClick={onClick}
      underline={underline}
      appearance={showAsLink ? LinkAppearance.Link : link.appearance}
      displayClass={displayClass}
      {...linkProps}
      icon={
        showExternalLinkIcon ? (
          <ExternalIcon aria-label={t('externalLinkLabel')} className={iconClassNames} />
        ) : undefined
      }>
      {renderLinkInner()}
    </Link>
  );
}
