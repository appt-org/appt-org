import { PropsWithChildren } from 'react';
import classNames from 'classnames';

export type ContentBlockProps = {
  className?: string;
};

export function ContentBlock({ children, className }: PropsWithChildren<ContentBlockProps>) {
  const classes = classNames('mt-10 mb-12 last:mb-0 md:mb-20', className);

  return <section className={classes}>{children}</section>;
}
