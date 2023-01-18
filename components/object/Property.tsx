import classNames from 'classnames';

import { RichText } from 'shared/ui/cms/content';
import { Typography } from 'shared/ui/component-library';
import { PageAnchor } from 'shared/ui/cms/page';
import { PropertyApiModel } from 'shared/api/api-types';

type Props = {
  property: PropertyApiModel;
  showSource?: boolean;
};

export default function Object({ property, showSource = false }: Props) {
  const spanClasses = classNames('min-w-0', { 'mr-2 my-2': showSource });

  return (
    <div className="mt-16">
      <Typography className="mb-4" tag="h2" size="heading-m">
        <PageAnchor className="flex items-center flex-wrap" text={property.title}>
          <span className={spanClasses}>{property.title}</span>
          {showSource && (
            <Typography className="bg-surface px-2 rounded-md my-2" tag="span" size="paragraph-s">
              {property.objectName}
            </Typography>
          )}
        </PageAnchor>
      </Typography>
      <RichText text={property.text} />
    </div>
  );
}
