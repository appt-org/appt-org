import { PropsWithChildren } from 'react';
import { default as NextLink, LinkProps as NextLinkProps } from 'next/link';

import { Anchor, AnchorProps } from 'shared/ui/component-library';
import { LinkAppearance } from 'shared/api/api-types';

export type LinkProps = Omit<AnchorProps, 'href'> & NextLinkProps;

export function Link({
  className,
  children,
  target,
  active,
  underline,
  title,
  onClick,
  appearance = LinkAppearance.Link,
  displayClass,
  icon,
  prefetch,
  ...linkProps
}: PropsWithChildren<LinkProps>) {
  return (
    <NextLink {...linkProps} prefetch={prefetch ? undefined : false} passHref>
      <Anchor
        className={className}
        title={title}
        target={target}
        active={active}
        underline={underline}
        aria-current={active ? 'page' : undefined}
        onClick={onClick}
        appearance={appearance}
        displayClass={displayClass}
        icon={icon}>
        {children}
      </Anchor>
    </NextLink>
  );
}
