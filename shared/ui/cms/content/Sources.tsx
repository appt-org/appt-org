import { useTranslation } from 'next-i18next';

import { CFLink } from 'shared/ui/cms/content';
import { Typography, List } from 'shared/ui/component-library';
import { PageAnchor } from 'shared/ui/cms/page';
import { LinkApiModel } from 'shared/api/api-types';

export type SourcesProps = {
  sources: LinkApiModel[];
};

export function Sources({ sources }: SourcesProps) {
  const { t } = useTranslation();
  const title = t('resourcesTitle');

  return (
    <>
      <Typography tag="h2" size="heading-l" withMargins>
        <PageAnchor text={title}>{title}</PageAnchor>
      </Typography>
      <List className="list-disc list-inside">
        {sources.map((source, index) => (
          <li className="mt-4" key={source.title + index}>
            <CFLink showAsLink link={source} />
          </li>
        ))}
      </List>
    </>
  );
}
