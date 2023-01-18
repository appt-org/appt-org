import { Document } from '@contentful/rich-text-types';

import { CONTENT_TYPE, LOCALE_CODE } from 'shared/api/contentful/contentful-types';

export type PageType = PickFromUnion<
  CONTENT_TYPE,
  'pageHomePage' | 'pageContentPage' | 'pageGuidelinePage' | 'pageObjectPage'
>;
export type Page = HomePageApiModel | ContentPageApiModel | GuidelinePageApiModel | ObjectPageApiModel;

export type ColumnBlockType = PickFromUnion<
  CONTENT_TYPE,
  'image' | 'textBlock' | 'mediaTextBlock' | 'linkList' | 'video' | 'quoteBlock' | 'percentageBlock'
>;
export type ColumnBlock =
  | ImageApiModel
  | MediaTextBlockApiModel
  | TextBlockApiModel
  | LinkListApiModel
  | VideoApiModel
  | QuoteBlockApiModel
  | PercentageBlockApiModel;

export type ApiModelWithId = { id: string };
export type ApiModelWithType<T extends CONTENT_TYPE> = { type: PickFromUnion<CONTENT_TYPE, T> };

export type BasePageApiModel = {
  type: PageType;
  id: string;
  locale: LOCALE_CODE;
  createdAt: string;
  updatedAt: string;
  title: string;
  shortDescription: string;
  thumbnail?: ImageApiModel;
  seo?: SeoApiModel;
  layout?: LayoutApiModel;
  authors?: LinkApiModel[];
  sources?: LinkApiModel[];
  showPageDate?: boolean;
  platformFilter?: string;
};

export interface HomePageApiModel extends BasePageApiModel {
  type: 'pageHomePage';
  text: Document;
  hero?: HeroApiModel;
}

export interface ContentPageApiModel extends BasePageApiModel {
  type: 'pageContentPage';
  text: Document;
  hero?: HeroApiModel;
}

export interface GuidelinePageApiModel extends BasePageApiModel {
  type: 'pageGuidelinePage';
  prefix?: string;
  chapter: string;
  suffix?: string;
  text?: Document;
  chapterLinks?: LinkApiModel[];
  children?: GuidelinePageApiModel[];
}

export interface ObjectPageApiModel extends BasePageApiModel {
  type: 'pageObjectPage';
  text: Document;
  parentObject?: RelatedObjectPageApiModel;
  implementedObjects?: RelatedObjectPageApiModel[];
  properties: PropertyApiModel[];
  relatedProperties: PropertyApiModel[];
  extraText?: Document;
}

export type RelatedObjectPageApiModel = {
  title: string;
  properties: PropertyApiModel[];
  parentObject?: RelatedObjectPageApiModel;
  implementedObjects?: RelatedObjectPageApiModel[];
};

export type PropertyApiModel = {
  title: string;
  objectName: string;
  text: Document;
} & ApiModelWithId;

export type SeoApiModel = {
  title?: string;
  description?: string;
  keywords?: string[];
  no_index?: boolean;
  no_follow?: boolean;
};

export type HeroApiModel = {
  title?: string;
  introText?: string;
  image?: ImageApiModel;
  useThumbnail: boolean;
};

export type ContentNavigationApiModel = {
  navigationItems: NavigationItemApiModel[];
};

export type NavigationItemApiModel = {
  title?: string;
  titlePrefix?: string;
  subtitle?: string;
  link?: LinkApiModel;
  nestedLinks?: (LinkApiModel | NavigationItemApiModel)[];
} & ApiModelWithId &
  ApiModelWithType<'navigationItem'>;

export type LayoutApiModel = {
  inPageNavigation: boolean;
  contentNavigation?: ContentNavigationApiModel;
};

export type VideoApiModel = {
  title: string;
  videoId: string;
  thumbnail?: ImageApiModel;
};

export type ImageApiModel = {
  lightAsset: ImageAssetApiModel;
  darkAsset?: ImageAssetApiModel;
  contain: boolean;
};

export type ImageAssetApiModel = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type SiteNavigationApiModel = {
  logoLink: LinkApiModel;
  mainNavigationLinks: LinkApiModel[];
  footerNavigationLinks?: LinkApiModel[];
  footerPartnerLogos?: LinkApiModel[];
  footerSponsorLogos?: LinkApiModel[];
  footerText?: Document;
};

export type PageListApiModel = {
  links: LinkApiModel[];
  isHighlighted: boolean;
};

export type LinkListApiModel = {
  links: LinkApiModel[];
  isHighlighted: boolean;
};

export enum LinkAppearance {
  Link,
  PrimaryButton,
  SecondaryButton,
}

export type LinkApiModel = {
  title: string;
  page?: {
    url: string;
    title: string;
    shortDescription: string;
    thumbnail?: ImageApiModel;
  };
  externalUrl?: string;
  anchor?: string;
  targetBlank: boolean;
  image?: ImageApiModel;
  appearance: LinkAppearance;
} & ApiModelWithType<'link'>;

export type TwoColumnBlockApiModel = {
  rows: TwoColumnRowApiModel[];
};

export type TwoColumnRowApiModel = {
  leftColumns: ColumnBlockApiModel[];
  rightColumns: ColumnBlockApiModel[];
};

export type ColumnBlockApiModel = {
  content: ColumnBlock;
  type: ColumnBlockType;
};

export type TextBlockApiModel = {
  text: Document;
  showBackgroundColor: boolean;
  link?: LinkApiModel;
};

export type MediaTextBlockApiModel = {
  title: string;
  text: Document;
  image?: ImageApiModel;
  link?: LinkApiModel;
  isImageLeft: boolean;
};

export type PercentageBlockApiModel = {
  id: string;
  text: Document;
  metrics: AccessibilityMetricApiModel[];
  link?: LinkApiModel;
  baseValue?: number;
};

export type AccessibilityMetricApiModel = {
  title: string;
  number: number;
  isPercentage: boolean;
};

export type FlatSitemap = Record<string, SitemapPageApiModel>;
export type SitemapPageApiModel = {
  id: string;
  publishedAt: string;
  slug: string;
  path: string;
  title: string;
  locale: string;
  parent: {
    slug: string;
    sys: {
      id: string;
    };
  };
};

export type RichTextEmbeddedEntry = {
  contentType: CONTENT_TYPE;
  component?:
    | LinkListApiModel
    | PageListApiModel
    | ImageApiModel
    | CodeSampleApiModel
    | MediaTextBlockApiModel
    | TwoColumnBlockApiModel
    | VideoApiModel
    | QuoteBlockApiModel
    | PercentageBlockApiModel;
};

export type ProgrammingLanguageApiModel = {
  name: string;
  platform: string;
  prismLanguage: string;
  version?: string;
};

export type CodeBlockApiModel = {
  name: string;
  text?: Document;
  code: string;
  programmingLanguage: ProgrammingLanguageApiModel;
  docsUrl?: string;
};

export type CodeSampleApiModel = {
  codeBlocks: CodeBlockApiModel[];
};

export type QuoteBlockApiModel = {
  internalName: string;
  quote: string;
  name: string;
  extraInfo?: string;
  link?: LinkApiModel;
  image?: ImageApiModel;
  isImageLeft: boolean;
};
