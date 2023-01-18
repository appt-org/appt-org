import { CSSProperties } from 'react';
import classNames from 'classnames';

import {
  ColumnBlockApiModel,
  ImageApiModel,
  LinkListApiModel,
  MediaTextBlockApiModel,
  PercentageBlockApiModel,
  QuoteBlockApiModel,
  TextBlockApiModel,
  TwoColumnBlockApiModel,
  VideoApiModel,
} from 'shared/api/api-types';
import {
  CFImage,
  MediaTextBlock,
  LinkList,
  Video,
  QuoteBlock,
  PercentageBlock,
  TextBlock,
} from 'shared/ui/cms/content';
import { useLayout } from 'shared/ui/cms/layout/LayoutContext';

export type TwoColumnBlockProps = {
  block: TwoColumnBlockApiModel;
};

export function TwoColumnBlock({ block }: TwoColumnBlockProps) {
  const { hasContentNavigation, hasSideNavigation } = useLayout();
  const hasLargerBreakpoint = hasContentNavigation || hasSideNavigation;

  function renderColumnBlock(column: ColumnBlockApiModel) {
    switch (column.type) {
      case 'image':
        const imageClasses = classNames('relative h-72 flex-1 self-stretch sm:h-96', {
          'lg:h-auto lg:min-h-[360px]': !hasLargerBreakpoint,
          '2xl:h-auto 2xl:min-h-[360px]': hasLargerBreakpoint,
        });

        return (
          <div className={imageClasses}>
            <CFImage
              className="object-cover w-full"
              image={column.content as ImageApiModel}
              sizes="(min-width: 80rem) 37.5rem, 45vw"
            />
          </div>
        );
      case 'textBlock':
        return <TextBlock block={column.content as TextBlockApiModel} />;
      case 'mediaTextBlock':
        return <MediaTextBlock block={column.content as MediaTextBlockApiModel} />;
      case 'linkList':
        return <LinkList className="flex-1 self-start" list={column.content as LinkListApiModel} disableHighlight />;
      case 'video':
        return <Video className="self-start" video={column.content as VideoApiModel} />;
      case 'quoteBlock':
        return <QuoteBlock block={column.content as QuoteBlockApiModel} />;
      case 'percentageBlock':
        return <PercentageBlock block={column.content as PercentageBlockApiModel} />;
      default:
        console.warn(
          `Trying to render unknown column block with content type ${column.type}. Make sure to add it in TwoColumnBlock.tsx.`,
        );
        break;
    }
  }

  const rowClasses = classNames('grid gap-4 grid-cols-1', {
    'lg:grid-cols-2 lg:gap-4': !hasLargerBreakpoint,
    '2xl:grid-cols-2 2xl:gap-4': hasLargerBreakpoint,
  });
  const colClasses = classNames('contents');
  // This is not the prettiest styling solution, but it does allow for a mostly CSS approach using grid to create
  // a very flexible two column block.
  const colItemClasses = classNames('flex', {
    'max-lg:!order-none': !hasLargerBreakpoint,
    'max-2xl:!order-none': hasLargerBreakpoint,
  });

  function getOrderStyle(order: number): CSSProperties | undefined {
    return order > 0 ? { order } : undefined;
  }

  return (
    <>
      {block.rows.map((row, index) => (
        <div key={index} className={rowClasses}>
          <div className={colClasses}>
            {row.leftColumns.map((column, index) => (
              <div className={colItemClasses} style={getOrderStyle(1 + index * 2)} key={index}>
                {renderColumnBlock(column)}
              </div>
            ))}
          </div>
          <div className={colClasses}>
            {row.rightColumns.map((column, index) => {
              const isFirstCol = index === 0;
              const classes = classNames(colItemClasses, {
                'mt-8': isFirstCol,
                'lg:mt-0': !hasLargerBreakpoint,
                '2xl:mt-0': hasLargerBreakpoint,
              });

              return (
                <div className={classes} style={getOrderStyle(2 + index * 2)} key={index}>
                  {renderColumnBlock(column)}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
