import { ContentPageApiModel } from 'shared/api/api-types';
import { Authors, PageDate, RichText, Sources } from 'shared/ui/cms/content';
import { Layout } from 'shared/ui/cms/layout';
import { LayoutType } from 'shared/ui/cms/layout/LayoutContext';
import { Contribute } from 'shared/ui/cms/page';
import { ContentBlock, Typography } from 'shared/ui/component-library';

export type ContentPageProps = {
  page: ContentPageApiModel;
  layout: LayoutType;
};

export default function ContentPage({ page, layout }: ContentPageProps) {
  return (
    <Layout layout={layout}>
      <article>
        {!page.hero && (
          <Typography className="mb-8" tag="h1" size="heading-xl">
            {page.title}
          </Typography>
        )}
        {page.showPageDate && <PageDate createdAt={page.createdAt} updatedAt={page.updatedAt} />}
        <RichText text={page.text} />
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
