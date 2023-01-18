import React, { AnchorHTMLAttributes, useMemo, forwardRef, PropsWithChildren } from 'react';
import classNames from 'classnames';
import { LinkAppearance } from 'shared/api/api-types';

export type AnchorProps = {
  href?: string;
  onClick?: React.MouseEventHandler;
  className?: string;
  active?: boolean;
  underline?: boolean;
  appearance?: LinkAppearance;
  icon?: JSX.Element;
  displayClass?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const Anchor = forwardRef<HTMLAnchorElement, PropsWithChildren<AnchorProps>>(
  (
    {
      className,
      href,
      onClick,
      children,
      active,
      underline,
      appearance = LinkAppearance.Link,
      icon,
      displayClass = 'inline',
      ...anchorProps
    },
    ref,
  ) => {
    const anchorClasses = useMemo(() => {
      const defaultButtonClasses = classNames(
        'py-1.5 px-6 rounded-lg inline-block border-2 border-accent transition-all hover:border-accent-hover duration-200 out-quint max-w-full break-words',
        {
          'relative pl-14': !!icon,
        },
      );

      switch (appearance) {
        case LinkAppearance.Link:
          return classNames('transition ease-out-quint duration-200 items-center', className, displayClass, {
            'text-accent': !active,
            'text-body underline': active,
            'underline hover:no-underline': underline,
            'hover:underline': !underline,
          });
        case LinkAppearance.PrimaryButton:
          return classNames('bg-accent text-onaccent hover:bg-accent-hover hover:shadow-elevate', defaultButtonClasses);
        case LinkAppearance.SecondaryButton:
          return classNames(
            'text-accent hover:text-accent-hover hover:bg-accent hover:bg-opacity-5',
            defaultButtonClasses,
          );
      }
    }, [appearance, className, displayClass, active, underline, icon]);

    return (
      <a className={anchorClasses} href={href} onClick={onClick} rel="noreferrer" ref={ref} {...anchorProps}>
        {children}
        {icon && icon}
      </a>
    );
  },
);

Anchor.displayName = 'Anchor';

export { Anchor };
