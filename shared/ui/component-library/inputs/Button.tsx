import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import classNames from 'classnames';

export type ButtonColor = 'surface' | 'onsurface';
export type ButtonSize = 'small' | 'medium';
export type ButtonProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  iconLeft?: JSX.Element;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  color = 'onsurface',
  size = 'medium',
  className,
  iconLeft,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const classes = classNames('rounded-lg', className, {
    'bg-onsurface': color === 'onsurface',
    'bg-surface': color === 'surface',
    'px-1 py-1': size === 'small',
    'px-2 py-2': size === 'medium',
  });

  return (
    <button className={classes} {...props}>
      {iconLeft && <span className="w-8 h-8">{iconLeft}</span>}
      {children}
    </button>
  );
}
