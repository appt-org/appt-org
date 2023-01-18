import { Typography, List } from 'shared/ui/component-library';
import { CFLink } from 'shared/ui/cms/content';
import { ContentNavigationItemTitle } from 'shared/ui/cms/layout';
import { NavigationItemApiModel } from 'shared/api/api-types';
import { useRoute } from 'shared/useRoute';

export type ContentSubNavigationItemProps = {
  item: NavigationItemApiModel;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function ContentSubNavigationItem({ item, onClick }: ContentSubNavigationItemProps) {
  const { path } = useRoute();

  if (Object.values(item).every(el => !el)) {
    return null;
  }

  return (
    <li className="mt-4 first:mt-0">
      <Typography className="mb-4" tag="p" size="heading-xs">
        {item.link ? (
          <CFLink showAsLink className="font-normal" link={item.link} active={item.link.page?.url === path}>
            <ContentNavigationItemTitle title={item.title} titlePrefix={item.titlePrefix} />
          </CFLink>
        ) : (
          <ContentNavigationItemTitle title={item.title} titlePrefix={item.titlePrefix} />
        )}
      </Typography>
      {item.nestedLinks?.length && (
        <section>
          <List className="pl-3" onClick={e => e.stopPropagation()}>
            {item.nestedLinks?.map((link, index) => {
              if ('page' in link) {
                return (
                  <li key={link.title + index}>
                    {
                      <CFLink
                        showAsLink
                        className="px-3 py-2 -mt-2 -mx-2 w-full"
                        link={link}
                        active={link.page?.url === path}
                        onClick={onClick}
                      />
                    }
                  </li>
                );
              } else {
                return <ContentSubNavigationItem key={index} onClick={onClick} item={link as NavigationItemApiModel} />;
              }
            })}
          </List>
        </section>
      )}
    </li>
  );
}
