import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import _cloneDeep from 'lodash/cloneDeep';
import { Block, BLOCKS, Document, Inline, INLINES, Text, TopLevelBlock } from '@contentful/rich-text-types';
import { Asset, Entry } from 'contentful';

import {
  ContentNavigationApiModel,
  ContentPageApiModel,
  HomePageApiModel,
  ImageApiModel,
  ImageAssetApiModel,
  LayoutApiModel,
  LinkApiModel,
  NavigationItemApiModel,
  LinkListApiModel,
  ObjectPageApiModel,
  Page,
  PropertyApiModel,
  RichTextEmbeddedEntry,
  SeoApiModel,
  SiteNavigationApiModel,
  MediaTextBlockApiModel,
  GuidelinePageApiModel,
  TwoColumnBlockApiModel,
  TwoColumnRowApiModel,
  ColumnBlockApiModel,
  ColumnBlock,
  VideoApiModel,
  TextBlockApiModel,
  PageListApiModel,
  HeroApiModel,
  QuoteBlockApiModel,
  PercentageBlockApiModel,
  AccessibilityMetricApiModel,
  LinkAppearance,
  RelatedObjectPageApiModel,
} from 'shared/api/api-types';
import {
  CONTENT_TYPE,
  IContentNavigation,
  IImage,
  ILayout,
  ILink,
  INavigationItem,
  ILinkList,
  IPageContentPage,
  IPageHomePage,
  IPageObjectPage,
  IProperty,
  ISeo,
  ISiteNavigation,
  LOCALE_CODE,
  IMediaTextBlock,
  IPageGuidelinePage,
  ITwoColumnBlock,
  ITwoColumnRow,
  ITextBlock,
  IVideo,
  IPageList,
  IHero,
  IQuoteBlock,
  IPercentageBlock,
  IAccessibilityMetric,
  IAccessibilityDataFeature,
  ILinkFields,
} from 'shared/api/contentful/contentful-types';
import {
  IPage,
  isCodeSampleEntry,
  isContentPageEntry,
  isGuidelinePageEntry,
  isHomePageEntry,
  isILink,
  isImageEntry,
  isINavigationItem,
  isLinkListEntry,
  isMediaTextBlockEntry,
  isObjectPageEntry,
  isPageListEntry,
  isPercentageBlockEntry,
  isQuoteBlockEntry,
  isTextBlockEntry,
  isTwoColumnBlockEntry,
  isVideoEntry,
} from 'shared/api/contentful/contentful-type-utils';
import { getSitemapItemById } from 'shared/api/sitemap-api';
import { getRelatedObjectPageProperties } from 'shared/utils/object-utils';
import { mapCodeSample, mapPlatform } from 'shared/api/contentful/contentful-code-mapper';
import _sortBy from 'lodash/sortBy';
import { getPageListLinksByTag } from 'shared/api/page-api';

export async function mapPage(page: IPage, locale: LOCALE_CODE): Promise<Page> {
  if (isHomePageEntry(page)) {
    return mapHomePage(page, locale);
  }
  if (isContentPageEntry(page)) {
    return mapContentPage(page, locale);
  }
  if (isObjectPageEntry(page)) {
    return mapObjectPage(page, locale);
  }
  if (isGuidelinePageEntry(page)) {
    return mapGuidelinePage(page, locale);
  }

  throw new Error(`Failed to map page content. Unknown page content type.`);
}

export async function mapSiteNavigation({ fields }: ISiteNavigation): Promise<SiteNavigationApiModel> {
  return omitUndefined({
    logoLink: await mapLink(fields.logoLink),
    mainNavigationLinks: await Promise.all(fields.mainNavigationLinks.map(link => mapLink(link))),
    footerNavigationLinks: fields.footerNavigationLinks
      ? await Promise.all(fields.footerNavigationLinks.map(link => mapLink(link)))
      : undefined,
    footerPartnerLogos: fields.footerPartnerLogos
      ? await Promise.all(fields.footerPartnerLogos.map(logoLink => mapLink(logoLink)))
      : undefined,
    footerSponsorLogos: fields.footerSponsorLogos
      ? await Promise.all(fields.footerSponsorLogos.map(logoLink => mapLink(logoLink)))
      : undefined,
    footerText: fields.footerText ? await mapRichText(fields.footerText) : undefined,
  });
}

export async function mapRichText(text: Document): Promise<Document> {
  const clonedText = _cloneDeep(text);

  return {
    ...clonedText,
    content: (await Promise.all(clonedText.content.map(node => mapRichTextNode(node)))) as TopLevelBlock[],
  };
}

export async function mapPageLink(page: IPage, title = page.fields.title): Promise<LinkApiModel> {
  return {
    type: 'link',
    title,
    page: await mapLinkPage(page),
    targetBlank: false,
    appearance: LinkAppearance.Link,
  };
}

async function mapLinkPage(page: IPage): Promise<LinkApiModel['page']> {
  return omitUndefined({
    url: await mapPageUrl(page),
    title: page.fields.title,
    shortDescription: page.fields.shortDescription,
    thumbnail: page.fields.thumbnail ? await mapImage(page.fields.thumbnail) : undefined,
  });
}

async function mapBasePage({ fields, sys }: IPage, locale: LOCALE_CODE) {
  return omitUndefined({
    locale,
    id: sys.id,
    createdAt: sys.createdAt,
    updatedAt: sys.updatedAt,
    title: fields.title,
    shortDescription: fields.shortDescription,
    thumbnail: fields.thumbnail ? mapImage(fields.thumbnail) : undefined,
    seo: fields.seo ? mapSeo(fields.seo) : undefined,
    layout: fields.layout ? await mapLayout(fields.layout) : undefined,
    authors: fields.authors ? await Promise.all(fields.authors.map(author => mapLink(author))) : undefined,
    sources: fields.sources ? await Promise.all(fields.sources.map(source => mapLink(source))) : undefined,
    showPageDate: fields.showPageDate,
    platformFilter: fields.platformFilter ? mapPlatform(fields.platformFilter) : undefined,
  });
}

async function mapHomePage(page: IPageHomePage, locale: LOCALE_CODE): Promise<HomePageApiModel> {
  return omitUndefined({
    ...(await mapBasePage(page, locale)),
    type: 'pageHomePage',
    hero: page.fields.hero ? await mapHero(page.fields.hero) : undefined,
    text: await mapRichText(page.fields.text),
  });
}

async function mapContentPage(page: IPageContentPage, locale: LOCALE_CODE): Promise<ContentPageApiModel> {
  return omitUndefined({
    ...(await mapBasePage(page, locale)),
    type: 'pageContentPage',
    hero: page.fields.hero ? await mapHero(page.fields.hero) : undefined,
    text: await mapRichText(page.fields.text),
  });
}

async function mapGuidelinePage(page: IPageGuidelinePage, locale: LOCALE_CODE): Promise<GuidelinePageApiModel> {
  return omitUndefined({
    ...(await mapBasePage(page, locale)),
    type: 'pageGuidelinePage',
    prefix: page.fields.prefix,
    chapter: page.fields.chapter,
    suffix: page.fields.suffix,
    text: page.fields.text ? await mapRichText(page.fields.text) : undefined,
    chapterLinks: page.fields.children
      ? await Promise.all(
          page.fields.children.map(guideline =>
            mapPageLink(
              guideline,
              `${guideline.fields.prefix} ${guideline.fields.chapter} - ${guideline.fields.title}`,
            ),
          ),
        )
      : undefined,
  });
}

async function mapObjectPage(page: IPageObjectPage, locale: LOCALE_CODE): Promise<ObjectPageApiModel> {
  const objectPage: ObjectPageApiModel = omitUndefined({
    ...(await mapBasePage(page, locale)),
    type: 'pageObjectPage',
    text: await mapRichText(page.fields.text),
    parentObject: page.fields.parentObject ? await mapRelatedObjectPage(page.fields.parentObject) : undefined,
    implementedObjects: page.fields.implementedObjects
      ? await Promise.all(page.fields.implementedObjects.map(obj => mapRelatedObjectPage(obj)))
      : undefined,
    properties: page.fields.properties ? await mapProperties(page.fields.properties, page.fields.title) : [],
    relatedProperties: [],
    extraText: page.fields.extraText ? await mapRichText(page.fields.extraText) : undefined,
  });

  objectPage.relatedProperties = getRelatedObjectPageProperties(objectPage);

  return objectPage;
}

async function mapRelatedObjectPage({ fields }: IPageObjectPage): Promise<RelatedObjectPageApiModel> {
  return omitUndefined({
    title: fields.title,
    properties: fields.properties ? await mapProperties(fields.properties, fields.title) : [],
    parentObject: fields.parentObject ? await mapRelatedObjectPage(fields.parentObject) : undefined,
    implementedObjects: fields.implementedObjects
      ? await Promise.all(fields.implementedObjects.map(obj => mapRelatedObjectPage(obj)))
      : undefined,
  });
}

async function mapProperties(properties: IProperty[], objectName: string) {
  const mappedProperties = await Promise.all(properties.map(property => mapProperty(property, objectName)));
  return _sortBy(mappedProperties, prop => prop.text);
}

async function mapProperty({ sys, fields }: IProperty, objectName: string): Promise<PropertyApiModel> {
  return {
    id: sys.id,
    title: fields.title,
    objectName,
    text: await mapRichText(fields.text),
  };
}

async function mapHero({ fields }: IHero): Promise<HeroApiModel> {
  return omitUndefined({
    title: fields.title,
    introText: fields.introText,
    image: fields.image ? await mapImage(fields.image) : undefined,
    useThumbnail: fields.useThumbnail,
  });
}

async function mapTwoColumnBlock({ fields }: ITwoColumnBlock): Promise<TwoColumnBlockApiModel> {
  return {
    rows: await Promise.all(fields.rows.map(row => mapTwoColumnRow(row))),
  };
}

async function mapTwoColumnRow({ fields }: ITwoColumnRow): Promise<TwoColumnRowApiModel> {
  return {
    leftColumns: await Promise.all(fields.leftColumns.map(column => mapColumnBlock(column))),
    rightColumns: await Promise.all(fields.rightColumns.map(column => mapColumnBlock(column))),
  };
}

async function mapColumnBlock(
  block: IImage | IMediaTextBlock | ITextBlock | ILinkList | IVideo | IQuoteBlock | IPercentageBlock,
): Promise<ColumnBlockApiModel> {
  const type = block.sys.contentType.sys.id;
  let content: ColumnBlock | undefined = undefined;

  if (isImageEntry(block)) {
    content = await mapImage(block);
  }
  if (isTextBlockEntry(block)) {
    content = await mapTextBlock(block);
  }
  if (isMediaTextBlockEntry(block)) {
    content = await mapMediaTextBlock(block);
  }
  if (isLinkListEntry(block)) {
    content = await mapLinkList(block);
  }
  if (isVideoEntry(block)) {
    content = mapVideo(block);
  }
  if (isQuoteBlockEntry(block)) {
    content = await mapQuoteBlock(block);
  }
  if (isPercentageBlockEntry(block)) {
    content = await mapPercentageBlock(block);
  }

  if (!content) {
    throw new Error(`Failed to map column block of type ${block.sys.contentType.sys['id']}. Make sure to map it.`);
  }

  return {
    content,
    type,
  };
}

async function mapTextBlock({ fields }: ITextBlock): Promise<TextBlockApiModel> {
  return omitUndefined({
    text: await mapRichText(fields.text),
    showBackgroundColor: fields.showBackgroundColor,
    link: fields.link ? await mapLink(fields.link) : undefined,
  });
}

async function mapPercentageBlock({ sys, fields }: IPercentageBlock): Promise<PercentageBlockApiModel> {
  return omitUndefined({
    id: sys.id,
    text: await mapRichText(fields.text),
    metrics: fields.metrics.map(metric => mapAccessibilityMetric(metric)),
    link: fields.link ? await mapLink(fields.link) : undefined,
    baseValue: fields.baseValue ? fields.baseValue : undefined,
  });
}

function mapAccessibilityMetric({ fields }: IAccessibilityMetric): AccessibilityMetricApiModel {
  return omitUndefined({
    title: fields.title,
    number:
      fields.number || (fields.feature ? mapAccessibilityDataFeatureNumber(fields.feature, fields.isPercentage) : 0),
    isPercentage: fields.isPercentage,
  });
}

function mapAccessibilityDataFeatureNumber({ fields }: IAccessibilityDataFeature, isPercentage = false): number {
  return isPercentage ? fields.percentage : fields.amount;
}

async function mapRichTextNode(node: Block | Inline | Text): Promise<Block | Inline | Text> {
  if ('content' in node) {
    switch (node.nodeType) {
      case INLINES.ENTRY_HYPERLINK: {
        const link = await mapRichTextEntryHyperlink(node);
        node.data = { link };
        break;
      }
      case BLOCKS.EMBEDDED_ENTRY: {
        node.data = await mapRichTextEmbeddedEntry(node);
        break;
      }
    }

    node.content = await Promise.all(node.content.map(child => mapRichTextNode(child)));
  }

  return node;
}

async function mapRichTextEntryHyperlink(node: Inline) {
  const contentType = node.data.target.sys.contentType.sys.id as CONTENT_TYPE;

  switch (contentType) {
    case 'link':
      return await mapLink(node.data.target);
    case 'pageHomePage':
    case 'pageContentPage':
    case 'pageGuidelinePage':
    case 'pageObjectPage':
      return await mapPageLink(node.data.target);
    default:
      throw new Error(`Failed to map rich text entry hyperlink node. Unsupported content type ${contentType}`);
  }
}

async function mapRichTextEmbeddedEntry(node: Block) {
  const entry = node.data.target as Entry<{}>;
  const contentType = node.data.target.sys.contentType.sys.id;

  let data: RichTextEmbeddedEntry = { contentType };

  if (isLinkListEntry(entry)) {
    data.component = await mapLinkList(entry);
  }
  if (isPageListEntry(entry)) {
    data.component = await mapPageList(entry);
  }
  if (isImageEntry(entry)) {
    data.component = await mapImage(entry);
  }
  if (isVideoEntry(entry)) {
    data.component = mapVideo(entry);
  }
  if (isCodeSampleEntry(entry)) {
    data.component = await mapCodeSample(entry);
  }
  if (isMediaTextBlockEntry(entry)) {
    data.component = await mapMediaTextBlock(entry);
  }
  if (isTwoColumnBlockEntry(entry)) {
    data.component = await mapTwoColumnBlock(entry);
  }
  if (isQuoteBlockEntry(entry)) {
    data.component = await mapQuoteBlock(entry);
  }
  if (isPercentageBlockEntry(entry)) {
    data.component = await mapPercentageBlock(entry);
  }

  if (!data.component) {
    console.warn(
      `Trying to map unknown rich text node with content type ${contentType}. Make sure to add it in contentful-mapper.ts.`,
    );
  }

  return data;
}

function mapVideo({ fields }: IVideo): VideoApiModel {
  return omitUndefined({
    title: fields.title,
    videoId: fields.videoId,
    thumbnail: fields.thumbnail ? mapImage(fields.thumbnail) : undefined,
  });
}

function mapImage({ fields }: IImage): ImageApiModel {
  return omitUndefined({
    lightAsset: mapImageAsset(fields.lightAsset),
    darkAsset: fields.darkAsset ? mapImageAsset(fields.darkAsset) : undefined,
    contain: fields.contain ?? false,
  });
}

function mapImageAsset({ fields }: Asset): ImageAssetApiModel {
  return omitUndefined({
    url: fields.file.url,
    alt: fields.title,
    width: fields.file.details.image?.width,
    height: fields.file.details.image?.height,
  });
}

async function mapPageList({ fields }: IPageList): Promise<PageListApiModel> {
  const links = await getPageListLinksByTag(fields.tag.sys.id);

  return {
    links: links || [],
    isHighlighted: fields.isHighlighted,
  };
}

async function mapLink({ sys, fields }: ILink): Promise<LinkApiModel> {
  return omitUndefined({
    type: sys.contentType.sys.id,
    title: fields.title,
    page: fields.page ? await mapLinkPage(fields.page) : undefined,
    externalUrl: fields.externalUrl,
    anchor: fields.anchor,
    targetBlank: fields.targetBlank,
    image: fields.image ? mapImage(fields.image) : undefined,
    appearance: mapLinkAppearance(fields.appearance),
  });
}

function mapLinkAppearance(appearance: ILinkFields['appearance']) {
  switch (appearance) {
    case 'Link':
      return LinkAppearance.Link;
    case 'Primary button':
      return LinkAppearance.PrimaryButton;
    case 'Secondary button':
      return LinkAppearance.SecondaryButton;
  }
}

async function mapLinkList({ fields }: ILinkList): Promise<LinkListApiModel> {
  return {
    links: await Promise.all(fields.links.map(link => mapLink(link))),
    isHighlighted: fields.isHighlighted,
  };
}

async function mapMediaTextBlock({ fields }: IMediaTextBlock): Promise<MediaTextBlockApiModel> {
  return omitUndefined({
    title: fields.title,
    text: await mapRichText(fields.text),
    image: fields.image ? await mapImage(fields.image) : undefined,
    link: fields.link ? await mapLink(fields.link) : undefined,
    isImageLeft: fields.isMediaLeft,
  });
}

async function mapPageUrl({ sys }: IPage): Promise<string> {
  const sitemapItem = await getSitemapItemById(sys.id, sys.locale as LOCALE_CODE);

  if (!sitemapItem) {
    throw new Error(`Failed to map page url with id ${sys.id}.`);
  }

  return sitemapItem.path;
}

function mapSeo({ fields }: ISeo): SeoApiModel {
  return omitUndefined({
    title: fields.title,
    description: fields.description,
    keywords: fields.keywords,
    no_index: fields.no_index,
    no_follow: fields.no_follow,
  });
}

async function mapLayout({ fields }: ILayout): Promise<LayoutApiModel> {
  return omitUndefined({
    inPageNavigation: fields.inPageNavigation,
    contentNavigation: fields.contentNavigation ? await mapContentNavigation(fields.contentNavigation) : undefined,
  });
}

async function mapContentNavigation({ fields }: IContentNavigation): Promise<ContentNavigationApiModel> {
  return {
    navigationItems: await Promise.all(fields.navigationItems.map(item => mapNavigationItem(item))),
  };
}

async function mapNavigationItem({ sys, fields }: INavigationItem): Promise<NavigationItemApiModel> {
  const link = fields.link ? await mapLink(fields.link) : undefined;
  const title = fields.title ?? link?.title;

  return omitUndefined({
    type: sys.contentType.sys.id,
    id: sys.id,
    title,
    titlePrefix: fields.titlePrefix,
    subtitle: fields.subtitle,
    link,
    nestedLinks: fields.nestedLinks
      ? await Promise.all(
          fields.nestedLinks.map(link => {
            if (isILink(link)) {
              return mapLink(link);
            }
            if (isINavigationItem(link)) {
              return mapNavigationItem(link);
            }

            throw new Error(`Failed to map unknown navigation item nested link. Make sure to add it.`);
          }),
        )
      : undefined,
  });
}

async function mapQuoteBlock({ fields }: IQuoteBlock): Promise<QuoteBlockApiModel> {
  return omitUndefined({
    internalName: fields.internalTitle,
    quote: fields.quote,
    name: fields.name,
    extraInfo: fields.extraInfo,
    link: fields.link ? await mapLink(fields.link) : undefined,
    image: fields.image ? mapImage(fields.image) : undefined,
    isImageLeft: fields.isMediaLeft,
  });
}

export function omitUndefined<T>(obj: T) {
  return _omitBy(obj, _isUndefined) as T;
}
