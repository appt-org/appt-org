import { FormEvent, PropsWithChildren } from 'react';
import classNames from 'classnames';

export type TabProps = {
  value: string | number;
  name?: string;
  selected?: boolean;
  onChange?: (e: FormEvent<HTMLInputElement>) => void;
  light?: boolean;
};

export function Tab({ children, value, name, onChange, selected = false, light = false }: PropsWithChildren<TabProps>) {
  const labelClasses = classNames('py-3 px-6 rounded-lg relative inline-block cursor-pointer hover:underline', {
    'text-body bg-onsurface': !light && selected,
    'text-body bg-surface': light && selected,
    'text-accent': !selected,
  });

  return (
    <label className={labelClasses}>
      {children}
      <input
        className="absolute inset-0 w-full h-full rounded-lg opacity-0 pointer-events-none"
        type="radio"
        onChange={onChange}
        name={name}
        value={value}
        checked={selected}
      />
    </label>
  );
}
