import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type TableHeaderCellProps = {
  className?: string;
};

export function TableHeaderCell({ className, children }: PropsWithChildren<TableHeaderCellProps>) {
  const classes = classNames('text-left border-b-4 border-background children:font-bold px-4', className);

  return <th className={classes}>{children}</th>;
}
