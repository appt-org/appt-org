import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export type TableProps = {
  className?: string;
};

export function Table({ className, children }: PropsWithChildren<TableProps>) {
  const classes = classNames('w-full bg-surface shadow-md', className);

  return (
    <table className={classes}>
      <tbody>{children}</tbody>
    </table>
  );
}
