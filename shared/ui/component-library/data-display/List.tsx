import { HTMLAttributes, PropsWithChildren } from 'react';

export type ListProps = {
  tag?: 'ul' | 'ol';
  className?: string;
} & HTMLAttributes<HTMLUListElement>;

export function List({ tag, className, children, ...listProps }: PropsWithChildren<ListProps>) {
  const ListComponent = tag ?? 'ul';

  return (
    <ListComponent className={className} role="list" {...listProps}>
      {children}
    </ListComponent>
  );
}
