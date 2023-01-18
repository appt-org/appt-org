import { FormEvent } from 'react';
import classNames from 'classnames';
import { CaretDownIcon } from 'icons/index';

export type SelectProps = {
  onChange: (e: FormEvent<HTMLSelectElement>) => void;
  options: { value: string; displayName: string; lang?: string }[];
  id: string;
  defaultValue?: string;
  selectedValue?: string;
  className?: string;
  backgroundClass?: string;
  accessibilityLabel: string;
};

export function Select({
  onChange,
  options,
  id,
  defaultValue,
  selectedValue,
  className,
  backgroundClass = 'bg-surface lg:bg-onsurface',
  accessibilityLabel,
}: SelectProps) {
  const containerClasses = classNames('relative inline-block text-body', className);
  const selectClasses = classNames(
    'w-full rounded-md pl-4 pr-16 py-2 placeholder-placeholder appearance-none focus:shadow-outline cursor-pointer',
    backgroundClass,
  );

  return (
    <div className={containerClasses}>
      <label className="sr-only" htmlFor={id}>
        {accessibilityLabel}
      </label>
      <select id={id} className={selectClasses} onChange={onChange} value={selectedValue || defaultValue}>
        {options.map(option => (
          <option key={option.value} value={option.value} lang={option.lang}>
            {option.displayName}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" aria-hidden>
        <CaretDownIcon className="w-8 h-8" />
      </div>
    </div>
  );
}
