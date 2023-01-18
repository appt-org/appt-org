import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type TableRowProps = {
  className?: string;
};

export function TableRow({ className, children }: PropsWithChildren<TableRowProps>) {
  const classes = classNames('border-b-2 border-background', className);

  return <tr className={classes}>{children}</tr>;
}
