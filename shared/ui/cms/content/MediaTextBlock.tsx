import { MediaTextBlockApiModel } from 'shared/api/api-types';
import { Typography } from 'shared/ui/component-library';
import { CFImage, CFLink, RichText } from 'shared/ui/cms/content';
import classNames from 'classnames';

export type MediaTextBlockProps = {
  block: MediaTextBlockApiModel;
  className?: string;
};

export function MediaTextBlock({ block, className }: MediaTextBlockProps) {
  const classes = classNames('flex flex-col items-center md:flex-row', className, {
    'md:flex-row-reverse': !block.isImageLeft,
  });

  return (
    <div className={classes}>
      {block.image && (
        <div className="relative block flex-1 grow-0 basis-[12.5rem] h-[12.5rem] w-[12.5rem] rounded-full mb-4 md:first:mr-6 md:mb-0">
          <CFImage
            className="rounded-full object-cover h-full"
            image={block.image}
            width={200}
            height={200}
            sizes="12.5rem"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col max-w-sm md:first:mr-6">
        <Typography tag="h2" size="heading-l">
          {block.title}
        </Typography>
        <RichText text={block.text} />
        {block.link && <CFLink className="self-end" link={block.link} />}
      </div>
    </div>
  );
}
