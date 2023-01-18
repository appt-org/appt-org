import { HomePageApiModel, LinkApiModel } from 'shared/api/api-types';
import { getEntries, getEntryById, getPageEntry } from 'shared/api/contentful/contentful-api';
import { mapPage, mapPageLink } from 'shared/api/contentful/contentful-mapper';
import { IPage } from 'shared/api/contentful/contentful-type-utils';
import { LOCALE_CODE } from 'shared/api/contentful/contentful-types';

export async function getHomePage(locale?: LOCALE_CODE, preview?: boolean) {
  const response = await getPageEntry({ pageType: 'pageHomePage', locale, preview });

  if (!response) {
    throw new Error('Failed to get home page. Response is not defined.');
  }

  const page = await mapPage(response.entry, response.locale);

  if (page.type !== 'pageHomePage') {
    throw new Error(`Failed to get home page. Not of type 'pageHomePage'`);
  }

  return page as HomePageApiModel;
}

export async function getPageById(id: string, locale?: LOCALE_CODE, preview?: boolean) {
  const response = await getEntryById<IPage>(id, { locale, preview });

  if (!response) {
    return null;
  }

  return await mapPage(response.entry, response.locale);
}

export async function getPageListLinksByTag(
  tagId: string,
  locale?: LOCALE_CODE,
  preview?: boolean,
): Promise<LinkApiModel[] | null> {
  const pageEntries = await getEntries<IPage>({
    content_type: 'pageContentPage',
    locale,
    preview,
    query: {
      'fields.tag.sys.id': tagId,
      limit: 100,
      order: 'fields.title',
    },
  });

  if (!pageEntries) {
    return null;
  }

  return await Promise.all(pageEntries.map(page => mapPageLink(page.entry)));
}
