import { LinkApiModel } from 'shared/api/api-types';
import { CFLink } from 'shared/ui/cms/content';
import { List } from 'shared/ui/component-library';
import { useRoute } from 'shared/useRoute';

export type FooterLinkListProps = {
  links: LinkApiModel[];
  onClick?: (link: LinkApiModel) => void;
};

export function FooterLinkList({ links, onClick }: FooterLinkListProps) {
  const { path } = useRoute();

  return (
    <List className="flex flex-1 flex-col -ml-2">
      {links.map((link, index) => (
        <li className="m-2" key={link.title + index}>
          <CFLink showAsLink link={link} active={path === link.page?.url} onClick={() => onClick?.(link)} />
        </li>
      ))}
    </List>
  );
}
