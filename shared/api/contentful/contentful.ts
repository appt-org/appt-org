import * as contentful from 'contentful';

export const DEFAULT_INCLUDE = 6;

export function createClient(preview = false) {
  return contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID as string,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    accessToken: (preview
      ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
      : process.env.CONTENTFUL_ACCESS_TOKEN) as string,
    removeUnresolved: true,
    ...(preview ? { host: 'preview.contentful.com' } : {}),
  });
}
