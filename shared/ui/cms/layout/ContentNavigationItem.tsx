import classNames from 'classnames';
import { useState, useEffect, MouseEvent } from 'react';

import { Typography, List } from 'shared/ui/component-library';
import { CFLink } from 'shared/ui/cms/content';
import { ContentNavigationItemTitle, ContentSubNavigationItem } from 'shared/ui/cms/layout';
import { ArrowDownIcon } from 'icons/index';
import { LinkApiModel, NavigationItemApiModel } from 'shared/api/api-types';
import { useRoute } from 'shared/useRoute';
import { logEvent } from 'shared/utils/analytics-utils';

export type ContentNavigationItemProps = {
  className?: string;
  item: NavigationItemApiModel;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

function containsItem(item: NavigationItemApiModel, path: string): boolean {
  return !!item.nestedLinks?.some(nestedItem => nestedItemContainsPath(nestedItem, path));
}

function nestedItemContainsPath(item: NavigationItemApiModel | LinkApiModel, path: string): boolean {
  return item.type === 'link'
    ? item.page?.url === path
    : item.link?.page?.url === path || !!item.nestedLinks?.some(nestedItem => nestedItemContainsPath(nestedItem, path));
}

export function ContentNavigationItem({ className, item, onClick }: ContentNavigationItemProps) {
  const { path } = useRoute();
  const [expanded, setExpanded] = useState(containsItem(item, path));
  const buttonId = `sidebar-button-${item.id}`;
  const sectionId = `sidebar-section-${item.id}`;

  useEffect(() => {
    setExpanded(containsItem(item, path));
  }, [item, path]);

  const classes = classNames('bg-surface text-body md:shadow-md', className);
  const iconClasses = classNames(
    'absolute right-4 top-1/2 transition-transform duration-300 out-quint transform origin-center -translate-y-1/2 w-8 h-8',
    {
      'rotate-180': expanded,
    },
  );
  const sectionClasses = classNames({
    hidden: !expanded,
  });

  function onLinkClick(e: MouseEvent<HTMLElement>, link: LinkApiModel) {
    logEvent({
      event: 'menu_click',
      menu_name: 'content_menu',
      menu_item_name: link.title,
      menu_item_url: link.page?.url || link.externalUrl,
    });

    onClick?.(e);
  }

  function toggle(e: MouseEvent<HTMLButtonElement>, item: NavigationItemApiModel) {
    logEvent({
      event: 'menu_click',
      menu_name: 'content_menu',
      menu_item_name: item.title,
      menu_action: expanded ? 'close' : 'open',
    });

    e.preventDefault();
    setExpanded(!expanded);
  }

  if (Object.values(item).every(el => !el)) {
    return null;
  }

  return (
    <li className={classes}>
      {item.link && (
        <CFLink
          showAsLink
          className="px-6 py-5 w-full text-heading-s"
          displayClass="inline-block"
          link={item.link}
          active={item.link.page?.url === path}
          onClick={e => item.link && onLinkClick(e, item.link)}>
          <ContentNavigationItemTitle title={item.title} titlePrefix={item.titlePrefix} />
        </CFLink>
      )}
      {item.nestedLinks?.length && (
        <>
          <Typography className="relative" tag="h3" size="heading-s">
            <button
              className="px-6 py-5 w-full text-left"
              id={buttonId}
              onClick={e => toggle(e, item)}
              aria-controls={sectionId}
              aria-expanded={expanded}>
              {item.title}
              <ArrowDownIcon className={iconClasses} aria-hidden />
            </button>
          </Typography>
          <section className={sectionClasses} id={sectionId} aria-labelledby={buttonId} aria-hidden={!expanded}>
            <List className="px-6 py-2" onClick={e => e.stopPropagation()}>
              {item.nestedLinks?.map((link, index) => {
                switch (link.type) {
                  case 'link': {
                    return (
                      <li className="border-b border-onsurface first:border-t last:border-0" key={link.title + index}>
                        {
                          <CFLink
                            showAsLink
                            className="px-3 -mx-3 py-3 w-full"
                            link={link}
                            active={link.page?.url === path}
                            onClick={e => item.link && onLinkClick(e, item.link)}
                            displayClass="inline-block"
                          />
                        }
                      </li>
                    );
                  }
                  case 'navigationItem': {
                    return <ContentSubNavigationItem key={index} onClick={onClick} item={link} />;
                  }
                  default:
                    throw new Error(
                      `Failed to render content navigation item nested link of type ${link['type']}. Make sure to add it.`,
                    );
                }
              })}
            </List>
          </section>
        </>
      )}
    </li>
  );
}
