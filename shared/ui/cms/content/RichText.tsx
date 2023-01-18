import { useMemo, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS, Document, Block, Inline } from '@contentful/rich-text-types';

import {
  Typography,
  ContentBlock,
  List,
  Link,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
} from 'shared/ui/component-library';
import { PageAnchor } from 'shared/ui/cms/page';
import {
  CFLink,
  CFImage,
  MediaTextBlock,
  LinkList,
  CodeSample,
  TwoColumnBlock,
  Video,
  QuoteBlock,
  PercentageBlock,
} from 'shared/ui/cms/content';
import { CONTENT_TYPE } from 'shared/api/contentful/contentful-types';
import { getRichTextNodeValue, inlineNodeContainsCodeMark } from 'shared/utils/rich-text';
import { ExternalIcon } from 'icons/index';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

export type RichTextProps = {
  text: Document;
  className?: string;
  noTopMargin?: boolean;
  noBottomMargin?: boolean;
  id?: string;
} & HTMLAttributes<HTMLElement>;

function renderPageAnchor(node: Block | Inline, children: ReactNode) {
  const headingText = getRichTextNodeValue(node);

  return <PageAnchor text={headingText || ''}>{children}</PageAnchor>;
}

export function RichText({
  text,
  className,
  noTopMargin = false,
  noBottomMargin = false,
  ...elementProps
}: PropsWithChildren<RichTextProps>) {
  const { t } = useTranslation();

  const classes = classNames(className, { 'first:children:mt-0': noTopMargin, 'first:children:mb-0': noBottomMargin });

  const options: Options = useMemo(
    () => ({
      renderNode: {
        [BLOCKS.PARAGRAPH]: (_, children) => (
          <Typography tag="p" size="paragraph" withMargins>
            {children}
          </Typography>
        ),
        [BLOCKS.HEADING_2]: (node, children) => (
          <Typography tag="h2" size="heading-l" withMargins>
            {renderPageAnchor(node, children)}
          </Typography>
        ),
        [BLOCKS.HEADING_3]: (node, children) => (
          <Typography tag="h3" size="heading-m" withMargins>
            {renderPageAnchor(node, children)}
          </Typography>
        ),
        [BLOCKS.HEADING_4]: (node, children) => (
          <Typography tag="h4" size="heading-s" withMargins>
            {renderPageAnchor(node, children)}
          </Typography>
        ),
        [BLOCKS.HEADING_5]: (node, children) => (
          <Typography tag="h5" size="heading-xs" withMargins>
            {renderPageAnchor(node, children)}
          </Typography>
        ),
        [BLOCKS.HEADING_6]: (node, children) => (
          <Typography tag="h6" size="heading-xs" withMargins>
            {renderPageAnchor(node, children)}
          </Typography>
        ),
        [BLOCKS.UL_LIST]: (_, children) => (
          <List tag="ul" className="list-disc ml-7">
            {children}
          </List>
        ),
        [BLOCKS.OL_LIST]: (_, children) => (
          <List tag="ol" className="list-decimal ml-7">
            {children}
          </List>
        ),
        [BLOCKS.TABLE]: (_, children) => (
          <ContentBlock className="overflow-x-auto">
            <Table>{children}</Table>
          </ContentBlock>
        ),
        [BLOCKS.TABLE_CELL]: (_, children) => <TableCell>{children}</TableCell>,
        [BLOCKS.TABLE_HEADER_CELL]: (_, children) => <TableHeaderCell>{children}</TableHeaderCell>,
        [BLOCKS.TABLE_ROW]: (_, children) => <TableRow>{children}</TableRow>,
        [BLOCKS.EMBEDDED_ENTRY]: node => {
          switch (node.data.contentType as CONTENT_TYPE) {
            case 'linkList':
              return (
                <ContentBlock>
                  <LinkList list={node.data.component} />
                </ContentBlock>
              );
            case 'pageList':
              return (
                <ContentBlock>
                  <LinkList list={node.data.component} />
                </ContentBlock>
              );
            case 'image':
              const image = node.data.component;
              const imageClasses = classNames('max-h-[80vh] object-contain object-left', {
                'w-full': !image.contain,
              });

              return (
                <ContentBlock>
                  <div className="relative">
                    <CFImage image={image} className={imageClasses} sizes="(min-width: 80rem) 75rem, 100vw" />
                  </div>
                </ContentBlock>
              );
            case 'video':
              return (
                <ContentBlock>
                  <Video video={node.data.component} />
                </ContentBlock>
              );
            case 'codeSample':
              return (
                <ContentBlock>
                  <CodeSample codeSample={node.data.component} />
                </ContentBlock>
              );
            case 'mediaTextBlock':
              return (
                <ContentBlock>
                  <MediaTextBlock block={node.data.component} />
                </ContentBlock>
              );
            case 'twoColumnBlock':
              return (
                <ContentBlock>
                  <TwoColumnBlock block={node.data.component} />
                </ContentBlock>
              );
            case 'quoteBlock':
              return (
                <ContentBlock>
                  <QuoteBlock block={node.data.component} />
                </ContentBlock>
              );
            case 'percentageBlock':
              return (
                <ContentBlock>
                  <PercentageBlock block={node.data.component} />
                </ContentBlock>
              );
            default:
              console.warn(
                `Trying to render unknown rich text node with content type ${node.data.contentType}. Make sure to add it in RichText.tsx.`,
              );
              break;
          }
        },
        [INLINES.ENTRY_HYPERLINK]: (node, children) => (
          <CFLink underline link={node.data.link}>
            {children}
          </CFLink>
        ),
        [INLINES.HYPERLINK]: (node, children) => {
          const containsCode = inlineNodeContainsCodeMark(node);

          return (
            <Link
              href={node.data.uri}
              underline
              className="underline"
              icon={
                containsCode ? undefined : (
                  <ExternalIcon aria-label={t('externalLinkLabel')} className="inline-block w-8 h-8 -mt-1 -mr-1.5" />
                )
              }>
              {children}
            </Link>
          );
        },
      },
      renderMark: {
        [MARKS.CODE]: children => <code className="bg-surface p-1 mx-0.5 rounded text-[0.9em]">{children}</code>,
      },
    }),
    [t],
  );

  return (
    <div className={classes} {...elementProps}>
      {documentToReactComponents(text, options)}
    </div>
  );
}
