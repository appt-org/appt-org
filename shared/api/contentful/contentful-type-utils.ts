import {
  CONTENT_TYPE,
  CONTENTFUL_DEFAULT_LOCALE_CODE,
  ICodeSample,
  IImage,
  ILink,
  ILinkList,
  IMediaTextBlock,
  INavigationItem,
  IPageContentPage,
  IPageGuidelinePage,
  IPageHomePage,
  IPageList,
  IPageObjectPage,
  IPercentageBlock,
  IQuoteBlock,
  ITextBlock,
  ITwoColumnBlock,
  IVideo,
  LOCALE_CODE,
} from 'shared/api/contentful/contentful-types';
import { Entry } from 'contentful';

export type LocalizedEntry<T extends Entry<any>> = Omit<T, 'fields'> & {
  fields: LocalizedFields<T['fields']>;
};

export type LocalizedFields<T extends Record<string, any>> = {
  [K in keyof T]: undefined extends T[K]
    ? LocalizedEntryOrField<NonNullable<T[K]>> | undefined
    : LocalizedEntryOrField<T[K]>;
};

type LocalizedEntryOrField<T> = T extends Entry<any> ? LocalizedEntry<T> : LocalizedField<T>;

type LocalizedField<T> = Record<PickFromUnion<LOCALE_CODE, CONTENTFUL_DEFAULT_LOCALE_CODE> & Partial<LOCALE_CODE>, T>;

function isContentType(entry: Entry<{}>, type: CONTENT_TYPE) {
  return entry.sys.contentType.sys.id === type;
}

/**
 * Discriminates generic contentful entry type by contentType value
 */
export const isHomePageEntry = (e: Entry<{}>): e is IPageHomePage => isContentType(e, 'pageHomePage');
export const isObjectPageEntry = (e: Entry<{}>): e is IPageObjectPage => isContentType(e, 'pageObjectPage');
export const isContentPageEntry = (e: Entry<{}>): e is IPageContentPage => isContentType(e, 'pageContentPage');
export const isGuidelinePageEntry = (e: Entry<{}>): e is IPageGuidelinePage => isContentType(e, 'pageGuidelinePage');
export const isLinkListEntry = (e: Entry<{}>): e is ILinkList => isContentType(e, 'linkList');
export const isPageListEntry = (e: Entry<{}>): e is IPageList => isContentType(e, 'pageList');
export const isTextBlockEntry = (e: Entry<{}>): e is ITextBlock => isContentType(e, 'textBlock');
export const isImageEntry = (e: Entry<{}>): e is IImage => isContentType(e, 'image');
export const isVideoEntry = (e: Entry<{}>): e is IVideo => isContentType(e, 'video');
export const isCodeSampleEntry = (e: Entry<{}>): e is ICodeSample => isContentType(e, 'codeSample');
export const isMediaTextBlockEntry = (e: Entry<{}>): e is IMediaTextBlock => isContentType(e, 'mediaTextBlock');
export const isTwoColumnBlockEntry = (e: Entry<{}>): e is ITwoColumnBlock => isContentType(e, 'twoColumnBlock');
export const isILink = (e: Entry<{}>): e is ILink => isContentType(e, 'link');
export const isINavigationItem = (e: Entry<{}>): e is INavigationItem => isContentType(e, 'navigationItem');
export const isQuoteBlockEntry = (e: Entry<{}>): e is IQuoteBlock => isContentType(e, 'quoteBlock');
export const isPercentageBlockEntry = (e: Entry<{}>): e is IPercentageBlock => isContentType(e, 'percentageBlock');

export type IPage = IPageHomePage | IPageContentPage | IPageObjectPage | IPageGuidelinePage;
