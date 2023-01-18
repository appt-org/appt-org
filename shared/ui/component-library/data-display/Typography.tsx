import classNames from 'classnames';
import { HTMLAttributes, PropsWithChildren } from 'react';

export type TypographySize =
  | 'heading-xxl'
  | 'heading-xl'
  | 'heading-l'
  | 'heading-m'
  | 'heading-s'
  | 'heading-xs'
  | 'paragraph'
  | 'paragraph-intro'
  | 'paragraph-s'
  | 'menu-item'
  | 'input-label'
  | 'quote';
export type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export function getTypographySizeByTag(tag: TypographyTag): TypographySize {
  switch (tag) {
    case 'h1':
      return 'heading-xl';
    case 'h2':
      return 'heading-l';
    case 'h3':
      return 'heading-m';
    case 'h4':
      return 'heading-s';
    case 'h5':
      return 'heading-xs';
    case 'h6':
      return 'heading-xs';
    case 'p':
      return 'paragraph';
    case 'span':
      return 'paragraph';
  }
}

export type TypographyProps = {
  className?: string;
  size?: TypographySize;
  tag?: TypographyTag;
  withMargins?: boolean;
} & HTMLAttributes<HTMLElement>;

export function Typography({
  className,
  size = 'paragraph',
  tag = 'p',
  withMargins,
  children,
  ...elementProps
}: PropsWithChildren<TypographyProps>) {
  const TypographyComponent = tag;

  const textSizes = {
    'text-heading-xxl': size === 'heading-xxl',
    'text-mobile-heading-xl sm:text-heading-xl': size === 'heading-xl',
    'text-heading-l': size === 'heading-l',
    'text-heading-m': size === 'heading-m',
    'text-heading-s': size === 'heading-s',
    'text-heading-xs': size === 'heading-xs',
    'text-paragraph': size === 'paragraph',
    'text-paragraph-intro': size === 'paragraph-intro',
    'text-paragraph-s': size === 'paragraph-s',
    'text-menu-item': size === 'menu-item',
    'text-input-label': size === 'input-label',
    'text-quote': size === 'quote',
  };

  const textLineHeights = {
    'leading-heading-xxl': size === 'heading-xxl',
    'leading-heading-xl': size === 'heading-xl',
    'leading-heading-l': size === 'heading-l',
    'leading-heading-m': size === 'heading-m',
    'leading-heading-s': size === 'heading-s',
    'leading-heading-xs': size === 'heading-xs',
    'leading-paragraph': size === 'paragraph',
    'leading-paragraph-intro': size === 'paragraph-intro',
    'leading-paragraph-s': size === 'paragraph-s',
    'leading-menu-item': size === 'menu-item',
    'leading-input-label': size === 'input-label',
    'leading-quote': size === 'quote',
  };

  const isLight = ['heading-xxl', 'heading-xl', 'heading-l', 'heading-m', 'heading-s'].includes(size);
  const isNormal = ['paragraph', 'paragraph-s', 'menu-item', 'input-label'].includes(size);
  const isMedium = ['heading-xs', 'paragraph-intro', 'quote'].includes(size);

  const isItalic = ['quote'].includes(size);

  const textWeights = {
    'font-light': isLight,
    'font-normal': isNormal,
    'font-medium': isMedium,
  };

  const textMargins = {
    'mt-12 mb-4': size === 'heading-l',
    'mt-12 mb-3': size === 'heading-m',
    'mt-10 mb-3': size === 'heading-s',
    'mt-8': size === 'heading-xs',
    'my-4': size === 'paragraph',
  };

  const textStyles = {
    italic: isItalic,
  };

  const hyphenationRule = {
    'hyphens-auto': tag === 'h1',
  };

  const classes = classNames(
    'text-body max-w-[44rem] break-words',
    {
      ...textSizes,
      ...textLineHeights,
      ...textWeights,
      ...(withMargins && textMargins),
      ...textStyles,
      ...hyphenationRule,
    },
    className,
  );

  return (
    <TypographyComponent className={classes} {...elementProps}>
      {children}
    </TypographyComponent>
  );
}
