import { KeyboardEvent, PropsWithChildren, useState } from 'react';
import classNames from 'classnames';
import FocusTrap from 'focus-trap-react';
import { Transition } from '@headlessui/react';
import { Button } from 'shared/ui/component-library';
import { CloseIcon } from 'icons/index';

export type ExpandableNavigationProps = {
  open: boolean;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  toggle: () => void;
  alignment: 'left' | 'right';
  breakpoint: 'md' | 'lg';
  closeButtonLabel: string;
  show: boolean;
};

function NavContainer({
  open,
  show,
  alignment,
  breakpoint,
  setIsFocusTrapActive,
  children,
}: PropsWithChildren<Partial<ExpandableNavigationProps> & { setIsFocusTrapActive: (isActive: boolean) => void }>) {
  const isLargeBreakpoint = breakpoint === 'lg';
  const isMediumBreakpoint = breakpoint === 'md';
  const isLeftNav = alignment === 'left';
  const isRightNav = alignment === 'right';

  const navClasses = classNames('text-body z-20 bg-surface top-0 fixed flex flex-col h-full', {
    'left-0': isLeftNav,
    'right-0 overflow-y-auto': isRightNav,
    'lg:relative lg:visible lg:block lg:bg-transparent': isLargeBreakpoint,
    'md:relative md:visible md:block md:bg-transparent': isMediumBreakpoint,
  });

  if (show) {
    return <div className={classNames(navClasses, 'hidden')}>{children}</div>;
  }

  return (
    <Transition
      as="div"
      show={open}
      enter="transition-all duration-300 out-quint motion-reduce:transition-none"
      enterFrom={`opacity-0 ${isLeftNav ? '-translate-x-full' : 'translate-x-full'}`}
      enterTo="opacity-100 translate-x-0"
      afterEnter={() => setIsFocusTrapActive(true)}
      leave="transition-all duration-300 out-quint motion-reduce:transition-none"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo={`opacity-0 ${isLeftNav ? '-translate-x-full' : 'translate-x-full'}`}
      beforeLeave={() => setIsFocusTrapActive(false)}
      className={navClasses}>
      {children}
    </Transition>
  );
}

export function ExpandableNavigation(props: PropsWithChildren<ExpandableNavigationProps>) {
  const { open, onKeyDown, toggle, breakpoint, closeButtonLabel, children } = props;
  const isLargeBreakpoint = breakpoint === 'lg';
  const isMediumBreakpoint = breakpoint === 'md';
  const [isFocusTrapActive, setIsFocusTrapActive] = useState(open);

  const closeButtonClasses = classNames('self-end m-4', {
    'lg:hidden': isLargeBreakpoint,
    'md:hidden': isMediumBreakpoint,
  });

  const overlayClasses = classNames('bg-overlay fixed top-0 left-0 w-full h-full z-10', {
    'lg:hidden': isLargeBreakpoint,
    'md:hidden': isMediumBreakpoint,
  });

  return (
    <FocusTrap active={isFocusTrapActive}>
      <div className="h-full" onKeyDown={onKeyDown}>
        <Transition
          as="div"
          show={open}
          enter="transition-opacity duration-300 out-quint motion-reduce:transition-none"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300 out-quint motion-reduce:transition-none"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={overlayClasses}
          onClick={toggle}
        />
        <NavContainer {...props} setIsFocusTrapActive={setIsFocusTrapActive}>
          <Button
            className={closeButtonClasses}
            color="onsurface"
            size="small"
            onClick={toggle}
            aria-label={closeButtonLabel}>
            <CloseIcon className="w-8 h8" />
          </Button>
          {children}
        </NavContainer>
      </div>
    </FocusTrap>
  );
}
