import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';
import { Entry } from 'contentful';

import { CONTENT_TYPE, LOCALE_CODE } from 'shared/api/contentful/contentful-types';
import { DEFAULT_LOCALE } from 'shared/utils/locale';
import { createClient, DEFAULT_INCLUDE } from 'shared/api/contentful/contentful';
import { PageType } from 'shared/api/api-types';
import { IPage, LocalizedEntry } from 'shared/api/contentful/contentful-type-utils';

const contentfulClient = createClient();
const contentfulPreviewClient = createClient(true);

export type EntryFetchOptions = {
  locale: LOCALE_CODE;
  include: number;
  preview?: boolean;
  content_type?: CONTENT_TYPE;
  query?: Record<string, string | boolean | number>;
};

export type EntryWithLocale<T extends Entry<any>> = { entry: T; locale: LOCALE_CODE };

const DEFAULT_ENTRY_FETCH_OPTIONS: EntryFetchOptions = {
  locale: DEFAULT_LOCALE,
  include: DEFAULT_INCLUDE,
};

function getClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient;
}

export async function getEntries<T extends Entry<any>>({
  content_type,
  locale,
  include,
  preview,
  query,
}: Partial<EntryFetchOptions>) {
  try {
    const options = {
      ...DEFAULT_ENTRY_FETCH_OPTIONS,
      ..._omitBy(
        {
          content_type,
          locale,
          include,
        },
        _isUndefined,
      ),
      ...query,
    };
    const [entryCollection, flatEntryCollection] = await Promise.all([
      getClient(preview || false).getEntries(options),
      getClient(preview || false).getEntries({
        ...options,
        locale: '*',
        resolveLinks: false,
        include: 0,
      }),
    ]);

    if (!entryCollection || !flatEntryCollection) {
      return null;
    }

    return entryCollection.items.map((entry, index) => ({
      entry: entry as unknown as T,
      locale: getFlatEntryLocale(flatEntryCollection.items[index] as Entry<any>, locale || DEFAULT_LOCALE),
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getEntry<T extends Entry<any>>(options: Partial<EntryFetchOptions>) {
  try {
    const entries = await getEntries<T>(options);

    if (!entries) {
      return null;
    }

    return entries[0] as unknown as EntryWithLocale<T>;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getEntryById<T extends Entry<any>>(
  id: string,
  { content_type, locale, include, preview, query }: Partial<EntryFetchOptions>,
) {
  try {
    const options = {
      ...DEFAULT_ENTRY_FETCH_OPTIONS,
      ..._omitBy(
        {
          content_type,
          locale,
          include,
        },
        _isUndefined,
      ),
      ...query,
    };

    const [entry, flatEntry] = await Promise.all([
      getClient(preview || false).getEntry(id, options),
      getClient(preview || false).getEntry(id, {
        ...options,
        locale: '*',
        resolveLinks: false,
        include: 0,
      }),
    ]);

    if (!entry || !flatEntry) {
      return null;
    }

    return {
      entry: entry as unknown as T,
      locale: getFlatEntryLocale(flatEntry as Entry<any>, locale || DEFAULT_LOCALE),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getPageEntry({
  pageType,
  slug,
  ...options
}: {
  pageType?: PageType;
  slug?: string;
} & Partial<EntryFetchOptions>) {
  return getEntry<IPage>({
    ...options,
    content_type: pageType,
    ..._omitBy(
      {
        query: {
          'fields.slug': slug,
          ...options.query,
        },
      },
      _isUndefined,
    ),
  });
}

/**
 * In Contentful we allow entries to be optionally localized by field. To correctly provide the language attribute on for
 * example the <main> tag for screen readers we need a locale based on the actual fields. This is a low effort way to
 * determine what the locale of the entry is. Note that this assumes content editors never partially translate on entry level.
 */
function getFlatEntryLocale<T extends Entry<any>>(entry: LocalizedEntry<T>, targetLocale: LOCALE_CODE) {
  return Object.entries(entry.fields).some(([_, value]) => !!value[targetLocale]) ? targetLocale : DEFAULT_LOCALE;
}
