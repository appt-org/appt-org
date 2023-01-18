import Property from 'components/object/Property';
import { ObjectPageApiModel } from 'shared/api/api-types';
import { Authors, PageDate, RichText, Sources } from 'shared/ui/cms/content';
import { Layout } from 'shared/ui/cms/layout';
import { LayoutType } from 'shared/ui/cms/layout/LayoutContext';
import { Contribute } from 'shared/ui/cms/page';
import { ContentBlock, Typography } from 'shared/ui/component-library';

export type ObjectPageProps = {
  page: ObjectPageApiModel;
  layout: LayoutType;
};

export default function ObjectPage({ page, layout }: ObjectPageProps) {
  return (
    <Layout layout={layout}>
      <article>
        <Typography className="mb-8" tag="h1" size="heading-xl">
          {page.title}
        </Typography>
        {page.showPageDate && <PageDate createdAt={page.createdAt} updatedAt={page.updatedAt} />}
        <RichText text={page.text} />
        {page.properties.map(property => (
          <Property key={property.id} property={property} />
        ))}
        {page.relatedProperties.map(property => (
          <Property key={property.id} property={property} showSource />
        ))}
        {page.extraText && <RichText text={page.extraText} />}
        {page.sources && (
          <ContentBlock>
            <Sources sources={page.sources} />
          </ContentBlock>
        )}
        {page.authors && (
          <ContentBlock>
            <Authors authors={page.authors} />
          </ContentBlock>
        )}
        <Contribute />
      </article>
    </Layout>
  );
}
