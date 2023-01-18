// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from 'contentful';
import { Document } from '@contentful/rich-text-types';

export interface IAccessibilityDataFeatureFields {
  /** Internal name */
  internalName: string;

  /** Feature key */
  featureKey: string;

  /** Property key */
  propertyKey: string;

  /** Platform */
  platform: string;

  /** Amount */
  amount: number;

  /** Percentage */
  percentage: number;
}

/** This entry is auto-generated. Do not edit manually! */

export interface IAccessibilityDataFeature extends Entry<IAccessibilityDataFeatureFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'accessibilityDataFeature';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IAccessibilityMetricFields {
  /** Internal name */
  name: string;

  /** Title */
  title: string;

  /** Feature */
  feature?: IAccessibilityDataFeature | undefined;

  /** Number */
  number?: number | undefined;

  /** Is percentage? */
  isPercentage: boolean;
}

export interface IAccessibilityMetric extends Entry<IAccessibilityMetricFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'accessibilityMetric';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ICodeBlockFields {
  /** Internal name */
  internalName: string;

  /** Name */
  name: string;

  /** Text */
  text?: Document | undefined;

  /** Code */
  code: Document;

  /** Programming language */
  programmingLanguage: IProgrammingLanguage;

  /** Official documentation url */
  docsUrl?: string | undefined;
}

export interface ICodeBlock extends Entry<ICodeBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'codeBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ICodeSampleFields {
  /** Internal name */
  internalName: string;

  /** Code blocks */
  codeBlocks: ICodeBlock[];
}

export interface ICodeSample extends Entry<ICodeSampleFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'codeSample';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IContentNavigationFields {
  /** Internal name */
  internalName: string;

  /** Navigation items */
  navigationItems: INavigationItem[];
}

export interface IContentNavigation extends Entry<IContentNavigationFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'contentNavigation';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IHeroFields {
  /** Internal name */
  internalName: string;

  /** Title */
  title?: string | undefined;

  /** Intro text */
  introText?: string | undefined;

  /** Image */
  image?: IImage | undefined;

  /** Use thumbnail as image? */
  useThumbnail: boolean;
}

export interface IHero extends Entry<IHeroFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'hero';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IImageFields {
  /** Internal name */
  name?: string | undefined;

  /** Light mode asset */
  lightAsset: Asset;

  /** Dark mode asset */
  darkAsset?: Asset | undefined;

  /** Display in original width/height */
  contain?: boolean | undefined;
}

export interface IImage extends Entry<IImageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'image';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ILayoutFields {
  /** Internal name */
  internalName: string;

  /** In page navigation */
  inPageNavigation: boolean;

  /** Content navigation */
  contentNavigation?: IContentNavigation | undefined;
}

export interface ILayout extends Entry<ILayoutFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'layout';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ILinkFields {
  /** Internal name */
  internalName: string;

  /** Title */
  title: string;

  /** Page */
  page?: IPageContentPage | IPageGuidelinePage | IPageHomePage | IPageObjectPage | undefined;

  /** External url */
  externalUrl?: string | undefined;

  /** Anchor */
  anchor?: string | undefined;

  /** Open in new tab? */
  targetBlank: boolean;

  /** Image */
  image?: IImage | undefined;

  /** Appearance */
  appearance: 'Link' | 'Primary button' | 'Secondary button';
}

export interface ILink extends Entry<ILinkFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'link';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ILinkListFields {
  /** Internal name */
  name: string;

  /** Links */
  links: ILink[];

  /** Is highlighted? */
  isHighlighted: boolean;
}

export interface ILinkList extends Entry<ILinkListFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'linkList';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IMediaTextBlockFields {
  /** Internal name */
  internalName: string;

  /** Title */
  title: string;

  /** Text */
  text: Document;

  /** Image */
  image?: IImage | undefined;

  /** Link */
  link?: ILink | undefined;

  /** Is media left? */
  isMediaLeft: boolean;
}

export interface IMediaTextBlock extends Entry<IMediaTextBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'mediaTextBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface INavigationItemFields {
  /** Internal name */
  internalName: string;

  /** Title */
  title?: string | undefined;

  /** Title prefix */
  titlePrefix?: string | undefined;

  /** Subtitle */
  subtitle?: string | undefined;

  /** Link */
  link?: ILink | undefined;

  /** Nested links */
  nestedLinks?: (ILink | INavigationItem)[] | undefined;
}

export interface INavigationItem extends Entry<INavigationItemFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'navigationItem';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageContentPageFields {
  /** Internal name */
  name: string;

  /** Slug */
  slug: string;

  /** Page title */
  title: string;

  /** Short description */
  shortDescription: string;

  /** Thumbnail */
  thumbnail?: IImage | undefined;

  /** Hero */
  hero?: IHero | undefined;

  /** Parent */
  parent: IPageContentPage | IPageGuidelinePage | IPageHomePage | IPageObjectPage;

  /** Layout */
  layout?: ILayout | undefined;

  /** SEO */
  seo?: ISeo | undefined;

  /** Tag */
  tag?: ITag | undefined;

  /** Sources */
  sources?: ILink[] | undefined;

  /** Authors */
  authors?: ILink[] | undefined;

  /** Show page date */
  showPageDate?: boolean | undefined;

  /** Code platform filter */
  platformFilter?: IPlatform | undefined;

  /** Text */
  text: Document;
}

export interface IPageContentPage extends Entry<IPageContentPageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pageContentPage';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageGuidelinePageFields {
  /** Internal Name */
  name: string;

  /** Slug */
  slug: string;

  /** Page title */
  title: string;

  /** Short description */
  shortDescription: string;

  /** Thumbnail */
  thumbnail?: IImage | undefined;

  /** Parent */
  parent: IPageContentPage | IPageGuidelinePage | IPageHomePage | IPageObjectPage;

  /** Layout */
  layout?: ILayout | undefined;

  /** SEO */
  seo?: ISeo | undefined;

  /** Sources */
  sources?: ILink[] | undefined;

  /** Authors */
  authors?: ILink[] | undefined;

  /** Show page date */
  showPageDate?: boolean | undefined;

  /** Code platform filter */
  platformFilter?: IPlatform | undefined;

  /** Chapter prefix */
  prefix?: string | undefined;

  /** Chapter */
  chapter: string;

  /** Chapter suffix */
  suffix?: string | undefined;

  /** Text */
  text?: Document | undefined;

  /** Children */
  children?: IPageGuidelinePage[] | undefined;
}

export interface IPageGuidelinePage extends Entry<IPageGuidelinePageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pageGuidelinePage';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageHomePageFields {
  /** Internal Name */
  name?: string | undefined;

  /** Page title */
  title: string;

  /** Short description */
  shortDescription: string;

  /** Thumbnail */
  thumbnail?: IImage | undefined;

  /** Hero */
  hero?: IHero | undefined;

  /** Layout */
  layout?: ILayout | undefined;

  /** SEO */
  seo?: ISeo | undefined;

  /** Sources */
  sources?: ILink[] | undefined;

  /** Authors */
  authors?: ILink[] | undefined;

  /** Show page date */
  showPageDate?: boolean | undefined;

  /** Code platform filter */
  platformFilter?: IPlatform | undefined;

  /** Text */
  text: Document;
}

export interface IPageHomePage extends Entry<IPageHomePageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pageHomePage';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageListFields {
  /** Internal name */
  internalName: string;

  /** Tag */
  tag: ITag;

  /** Is highlighted? */
  isHighlighted: boolean;
}

export interface IPageList extends Entry<IPageListFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pageList';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPageObjectPageFields {
  /** Internal Name */
  name?: string | undefined;

  /** Slug */
  slug: string;

  /** Page title */
  title: string;

  /** Short description */
  shortDescription: string;

  /** Thumbnail */
  thumbnail?: IImage | undefined;

  /** Parent */
  parent: IPageContentPage | IPageGuidelinePage | IPageHomePage | IPageObjectPage;

  /** Layout */
  layout?: ILayout | undefined;

  /** SEO */
  seo?: ISeo | undefined;

  /** Sources */
  sources?: ILink[] | undefined;

  /** Authors */
  authors?: ILink[] | undefined;

  /** Show page date */
  showPageDate?: boolean | undefined;

  /** Code platform filter */
  platformFilter?: IPlatform | undefined;

  /** Text */
  text: Document;

  /** Platform */
  platform: IPlatform;

  /** ParentObject */
  parentObject?: IPageObjectPage | undefined;

  /** ImplementedObjects */
  implementedObjects?: IPageObjectPage[] | undefined;

  /** Properties */
  properties?: IProperty[] | undefined;

  /** Extra text */
  extraText?: Document | undefined;
}

export interface IPageObjectPage extends Entry<IPageObjectPageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'pageObjectPage';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPercentageBlockFields {
  /** Internal name */
  name: string;

  /** Text */
  text: Document;

  /** Metrics */
  metrics: IAccessibilityMetric[];

  /** Link */
  link?: ILink | undefined;

  /** Base value */
  baseValue?: number | undefined;
}

export interface IPercentageBlock extends Entry<IPercentageBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'percentageBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPlatformFields {
  /** Internal name */
  internalName: string;

  /** Name */
  name: string;
}

export interface IPlatform extends Entry<IPlatformFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'platform';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IProgrammingLanguageFields {
  /** Internal name */
  internalName: string;

  /** Name */
  name: string;

  /** Version */
  version?: string | undefined;

  /** Prism language */
  prismLanguage:
    | 'swift'
    | 'objectivec'
    | 'dart'
    | 'javascript'
    | 'typescript'
    | 'kotlin'
    | 'java'
    | 'html'
    | 'tsx'
    | 'jsx'
    | 'csharp'
    | 'xml';

  /** Platform */
  platform: IPlatform;
}

export interface IProgrammingLanguage extends Entry<IProgrammingLanguageFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'programmingLanguage';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IPropertyFields {
  /** Internal name */
  name: string;

  /** Title */
  title: string;

  /** Text */
  text: Document;
}

export interface IProperty extends Entry<IPropertyFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'property';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IQuoteBlockFields {
  /** Internal title */
  internalTitle: string;

  /** Quote */
  quote: string;

  /** Name */
  name: string;

  /** Extra info */
  extraInfo?: string | undefined;

  /** Link */
  link?: ILink | undefined;

  /** Image */
  image?: IImage | undefined;

  /** Is media left? */
  isMediaLeft: boolean;
}

export interface IQuoteBlock extends Entry<IQuoteBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'quoteBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ISeoFields {
  /** Internal name */
  name: string;

  /** SEO title */
  title?: string | undefined;

  /** Description */
  description?: string | undefined;

  /** Keywords */
  keywords?: string[] | undefined;

  /** Hide page from search engines (noindex) */
  no_index?: boolean | undefined;

  /** Exclude links from search rankings? (nofollow) */
  no_follow?: boolean | undefined;
}

export interface ISeo extends Entry<ISeoFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'seo';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ISiteNavigationFields {
  /** Internal name */
  name: string;

  /** Logo link */
  logoLink: ILink;

  /** Main navigation links */
  mainNavigationLinks: ILink[];

  /** Footer text */
  footerText?: Document | undefined;

  /** Footer navigation links */
  footerNavigationLinks?: ILink[] | undefined;

  /** Footer partner logo's */
  footerPartnerLogos?: ILink[] | undefined;

  /** Footer sponsor logo's */
  footerSponsorLogos?: ILink[] | undefined;
}

export interface ISiteNavigation extends Entry<ISiteNavigationFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'siteNavigation';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ITagFields {
  /** Name */
  name: string;
}

export interface ITag extends Entry<ITagFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'tag';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ITextBlockFields {
  /** Internal name */
  name: string;

  /** Text */
  text: Document;

  /** Show background color */
  showBackgroundColor: boolean;

  /** Link */
  link?: ILink | undefined;
}

export interface ITextBlock extends Entry<ITextBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'textBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ITwoColumnBlockFields {
  /** Internal name */
  name: string;

  /** Rows */
  rows: ITwoColumnRow[];
}

export interface ITwoColumnBlock extends Entry<ITwoColumnBlockFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'twoColumnBlock';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface ITwoColumnRowFields {
  /** Internal name */
  name: string;

  /** Left columns */
  leftColumns: (IImage | ILinkList | IMediaTextBlock | IPercentageBlock | IQuoteBlock | ITextBlock | IVideo)[];

  /** Right columns */
  rightColumns: (IImage | ILinkList | IMediaTextBlock | IPercentageBlock | IQuoteBlock | ITextBlock | IVideo)[];
}

export interface ITwoColumnRow extends Entry<ITwoColumnRowFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'twoColumnRow';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export interface IVideoFields {
  /** Internal name */
  name: string;

  /** Title */
  title: string;

  /** Video Id */
  videoId: string;

  /** Thumbnail */
  thumbnail?: IImage | undefined;
}

export interface IVideo extends Entry<IVideoFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: 'video';
        linkType: 'ContentType';
        type: 'Link';
      };
    };
  };
}

export type CONTENT_TYPE =
  | 'accessibilityDataFeature'
  | 'accessibilityMetric'
  | 'codeBlock'
  | 'codeSample'
  | 'contentNavigation'
  | 'hero'
  | 'image'
  | 'layout'
  | 'link'
  | 'linkList'
  | 'mediaTextBlock'
  | 'navigationItem'
  | 'pageContentPage'
  | 'pageGuidelinePage'
  | 'pageHomePage'
  | 'pageList'
  | 'pageObjectPage'
  | 'percentageBlock'
  | 'platform'
  | 'programmingLanguage'
  | 'property'
  | 'quoteBlock'
  | 'seo'
  | 'siteNavigation'
  | 'tag'
  | 'textBlock'
  | 'twoColumnBlock'
  | 'twoColumnRow'
  | 'video';

export type LOCALE_CODE = 'en' | 'nl';

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'en';