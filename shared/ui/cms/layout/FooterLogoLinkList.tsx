import { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { LinkApiModel } from 'shared/api/api-types';
import { CFLink } from 'shared/ui/cms/content';
import { Typography, List } from 'shared/ui/component-library';
import { useRoute } from 'shared/useRoute';

export type FooterProps = {
  label: string;
  links: LinkApiModel[];
  onClick?: (link: LinkApiModel) => void;
  small?: boolean;
};

export function FooterLogoLinkList({ label, links, onClick, small = false }: PropsWithChildren<FooterProps>) {
  const { path } = useRoute();

  return (
    <div className="space-y-2">
      <Typography>{label}</Typography>
      <List className="flex flex-wrap gap-4">
        {links.map((link, index) => (
          <li className="flex" key={link.title + index}>
            <CFLink
              showAsLink
              className="flex"
              link={link}
              active={path === link.page?.url}
              onClick={() => onClick?.(link)}
              image
              imageProps={{
                className: classNames('w-auto', {
                  'h-12 max-w-[6.5rem]': !small,
                  'h-4 max-w-[4.5rem]': small,
                }),
                height: 48,
                width: 96,
                sizes: '5rem',
              }}
            />
          </li>
        ))}
      </List>
    </div>
  );
}
