import { CFImage, CFLink } from 'shared/ui/cms/content';
import { Typography, List, Card } from 'shared/ui/component-library';
import { LinkApiModel, LinkListApiModel } from 'shared/api/api-types';
import classNames from 'classnames';
import { logEvent } from 'shared/utils/analytics-utils';

export type LinkListProps = {
  list: LinkListApiModel;
  disableHighlight?: boolean;
  className?: string;
};

export function LinkList({ list, disableHighlight, className }: LinkListProps) {
  const isHighlighted = !disableHighlight && list.isHighlighted && list.links.every(link => !!link.page);

  function onLinkClick(link: LinkApiModel) {
    logEvent({
      event: 'content_block_click',
      block_name: 'link_list',
      block_item_name: link.title,
      block_item_url: link.page?.url || link.externalUrl,
    });
  }

  if (isHighlighted) {
    const classes = classNames('grid grid-cols-1 gap-4 md:grid-cols-2', className);

    return (
      <List className={classes}>
        {list.links.map((link, index) => (
          <Card className="flex flex-col justify-between" tag="li" key={link.title + index}>
            <div>
              <div className="flex items-center mb-4">
                {link.page?.thumbnail && (
                  <div className="mr-4 min-w-fit">
                    <CFImage className="object-cover h-full" image={link.page.thumbnail} width={50} height={50} />
                  </div>
                )}
                <Typography tag="h3" size="heading-m">
                  {link.page?.title}
                </Typography>
              </div>
              <Typography className="mb-4" tag="p" size="paragraph">
                {link.page?.shortDescription}
              </Typography>
            </div>
            <CFLink showAsLink className="self-end" link={link} onClick={() => onLinkClick(link)} />
          </Card>
        ))}
      </List>
    );
  }

  const classes = classNames('p-4', className);

  return (
    <Card className={classes} tag="ul">
      {list.links.map((link, index) => (
        <li className="border-t -px-3 border-onsurface first:border-t-0" key={link.title + index}>
          <CFLink showAsLink className="p-3" displayClass="block" link={link} onClick={() => onLinkClick(link)} />
        </li>
      ))}
    </Card>
  );
}
