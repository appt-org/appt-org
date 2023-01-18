import { useTranslation } from 'next-i18next';
import { GuidelinePageApiModel } from 'shared/api/api-types';
import { Authors, LinkList, PageDate, RichText, Sources } from 'shared/ui/cms/content';
import { Layout } from 'shared/ui/cms/layout';
import { LayoutType } from 'shared/ui/cms/layout/LayoutContext';
import { Contribute, PageAnchor } from 'shared/ui/cms/page';
import { ContentBlock, Typography } from 'shared/ui/component-library';

export type GuidelinePageProps = {
  page: GuidelinePageApiModel;
  layout: LayoutType;
};

export default function GuidelinePage({ page, layout }: GuidelinePageProps) {
  const { t } = useTranslation();

  return (
    <Layout layout={layout}>
      <article>
        <Typography className="uppercase" tag="p" size="paragraph">
          {page.prefix} {page.chapter} {page.suffix ? `- ${page.suffix}` : undefined}
        </Typography>
        <Typography className="mb-8" tag="h1" size="heading-xl">
          {page.title}
        </Typography>
        {page.showPageDate && <PageDate createdAt={page.createdAt} updatedAt={page.updatedAt} />}
        {page.text && <RichText text={page.text} />}
        {page.chapterLinks && (
          <ContentBlock>
            <Typography className="mb-4" tag="h2" size="heading-l" withMargins>
              <PageAnchor text={t('guidelines.chapters')}>{t('guidelines.chapters')}</PageAnchor>
            </Typography>
            <LinkList list={{ links: page.chapterLinks, isHighlighted: false }} />
          </ContentBlock>
        )}
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
