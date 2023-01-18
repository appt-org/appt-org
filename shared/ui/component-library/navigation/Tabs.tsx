import { HTMLAttributes, PropsWithChildren } from 'react';

export type TabsProps = HTMLAttributes<HTMLDivElement>;

export function Tabs({ children, ...props }: PropsWithChildren<TabsProps>) {
  return (
    <>
      <div role="radiogroup" {...props}>
        {children}
      </div>
    </>
  );
}
