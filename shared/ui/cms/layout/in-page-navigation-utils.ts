import { Block, BLOCKS, Document, Inline, Text } from '@contentful/rich-text-types';
import { getPageAnchorId, PageAnchor } from 'shared/utils/page-anchors';
import { getRichTextNodeValue } from 'shared/utils/rich-text';
import { TFunction } from 'next-i18next';
import {
  ContentPageApiModel,
  GuidelinePageApiModel,
  HomePageApiModel,
  ObjectPageApiModel,
  Page,
} from 'shared/api/api-types';

export function getPageAnchors(page: Page, t: TFunction) {
  // Build up list of page anchors based on contentful page type
  // Most of the page anchors come from the H2 headings of the rich text field of the page
  // Any 'hardcoded' sections are added manually
  switch (page.type) {
    case 'pageHomePage':
      return getContentOrHomePageAnchors(page, t);
    case 'pageContentPage':
      return getContentOrHomePageAnchors(page, t);
    case 'pageGuidelinePage':
      return getGuidelinePageAnchors(page, t);
    case 'pageObjectPage':
      return getObjectPageAnchors(page, t);
    default:
      throw new Error(
        `Failed to get page anchors for unknown page type ${page['type']}. Make sure to add support for it.`,
      );
  }
}

function getContentOrHomePageAnchors(page: ContentPageApiModel | HomePageApiModel, t: TFunction) {
  const anchors: PageAnchor[] = [];
  anchors.push(...getPageAnchorsFromRichText(page.text));

  if (page.sources) {
    anchors.push(getPageAnchorFromSources(t));
  }

  return anchors;
}

function getGuidelinePageAnchors(page: GuidelinePageApiModel, t: TFunction) {
  const anchors: PageAnchor[] = [];

  if (page.chapterLinks) {
    anchors.push({
      text: t('guidelines.chapters'),
      id: getPageAnchorId(t('guidelines.chapters')),
    });
  }

  if (page.text) {
    anchors.push(...getPageAnchorsFromRichText(page.text));
  }

  if (page.sources) {
    anchors.push(getPageAnchorFromSources(t));
  }

  return anchors;
}

function getObjectPageAnchors(page: ObjectPageApiModel, t: TFunction) {
  const anchors: PageAnchor[] = [];
  anchors.push(
    ...[...page.properties, ...page.relatedProperties].map(property => ({
      text: property.title,
      id: getPageAnchorId(property.title),
    })),
  );

  if (page.text) {
    anchors.push(...getPageAnchorsFromRichText(page.text));
  }

  if (page.sources) {
    anchors.push(getPageAnchorFromSources(t));
  }

  return anchors;
}

function getPageAnchorsFromRichText(richText: Document): PageAnchor[] {
  return richText.content.reduce(
    (pageAnchors: PageAnchor[], node) => [...pageAnchors, ...getPageAnchorsFromRichTextNode(node)],
    [],
  );
}

function getPageAnchorsFromRichTextNode(node: (Block | Inline | Text) | (Inline | Text)): PageAnchor[] {
  const pageAnchors: PageAnchor[] = [];

  // Only H2 headings are added to the list of page anchors at this time, because
  // this list will suffice to give a good overview and table of contents of the page
  if (node.nodeType === BLOCKS.HEADING_2) {
    const headingText = getRichTextNodeValue(node);

    if (headingText) {
      pageAnchors.push({ text: headingText, id: getPageAnchorId(headingText) });
    }
  }

  if ('content' in node) {
    node.content.forEach(childNode => {
      pageAnchors.push(...getPageAnchorsFromRichTextNode(childNode));
    });
  }

  return pageAnchors;
}

function getPageAnchorFromSources(t: TFunction) {
  const resourcesTitle = t('resourcesTitle');
  return { text: resourcesTitle, id: getPageAnchorId(resourcesTitle) };
}
