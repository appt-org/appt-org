import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type TableCellProps = {
  className?: string;
};

export function TableCell({ className, children }: PropsWithChildren<TableCellProps>) {
  const classes = classNames('px-4', className);

  return <td className={classes}>{children}</td>;
}
