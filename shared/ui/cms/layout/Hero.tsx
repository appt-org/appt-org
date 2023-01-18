import { ImageApiModel } from 'shared/api/api-types';
import { Typography } from 'shared/ui/component-library';
import { CFImage } from 'shared/ui/cms/content';
import classNames from 'classnames';

export type HeroProps = {
  title: string;
  introText?: string;
  image?: ImageApiModel;
};

export function Hero({ title, introText, image }: HeroProps) {
  const classes = classNames('flex flex-col items-center flex-1 md:flex-row', { 'justify-center': !!image });

  return (
    <div className="max-w-md w-full mx-auto px-0 py-8 sm:py-16 sm:px-8">
      <div className={classes}>
        {image && (
          <div className="relative self-stretch grow-0 mb-8 mt-0 md:my-auto md:mr-8 md:h-auto md:basis-1/3 shrink-0">
            <CFImage image={image} sizes="30vw" priority />
          </div>
        )}
        <Typography className="w-full" tag="h1" size="heading-xl">
          {title}
        </Typography>
      </div>
      {introText && (
        <Typography className="pt-4" tag="p" size="paragraph-intro">
          {introText}
        </Typography>
      )}
    </div>
  );
}
