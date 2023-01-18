import { QuoteBlockApiModel } from 'shared/api/api-types';
import { Typography } from 'shared/ui/component-library';
import { CFImage, CFLink } from 'shared/ui/cms/content';
import classNames from 'classnames';

export type QuoteBlockProps = {
  block: QuoteBlockApiModel;
  className?: string;
};

export function QuoteBlock({ block, className }: QuoteBlockProps) {
  const classes = classNames('flex flex-col items-center justify-center md:flex-row', className, {
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
      <div className="flex-1 flex flex-col max-w-sm text-center md:first:mr-6">
        <blockquote>
          <Typography className="before:content-[open-quote] after:content-[close-quote]" tag="p" size="quote">
            {block.quote}
          </Typography>
        </blockquote>
        <Typography className="mt-4 mx-auto" tag="p" size="paragraph">
          {block.name}
        </Typography>
        {block.extraInfo && (
          <Typography className="mx-auto" tag="p" size="paragraph-s">
            {block.extraInfo}
          </Typography>
        )}
        {block.link && <CFLink className="self-end mt-4" link={block.link} />}
      </div>
    </div>
  );
}
