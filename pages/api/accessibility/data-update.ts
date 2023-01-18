import { NextApiRequest, NextApiResponse } from 'next';
import { EntryProps, PlainClientAPI } from 'contentful-management';
import _capitalize from 'lodash/capitalize';
import _chunk from 'lodash/chunk';
import _isEqual from 'lodash/isEqual';

import { IAccessibilityDataFeatureFields } from 'shared/api/contentful/contentful-types';
import { DEFAULT_LOCALE } from 'shared/utils/locale';
import { LocalizedFields } from 'shared/api/contentful/contentful-type-utils';

type AccessibilityDataAggregationResponse = {
  [platform: string]: {
    features: {
      [featureKey: string]: AccessibilityDataFeatureResponse;
    };
  };
};

type AccessibilityDataFeatureResponse = {
  [featurePropertyKey: string]: AccessibilityDataPropertyResponse;
};

type AccessibilityDataPropertyResponse = {
  amount: number;
  percentage: number;
};

/**
 * The dataUpdate API route is called periodically through a configured Google Cloud Scheduler.
 * This function downloads a JSON file with all the aggregated accessibility setting data for both iOS and Android from
 * the accessibility data Cloud Storage Bucket.
 *
 * The downloaded data is then mapped and used to create or update Contentful accessibility feature entries through the
 * Contentful Management API. This allows up-to-date setting data like total users and percentages to be used in content blocks
 * which can be showed on the Appt website.
 */
export default async function dataUpdate(req: NextApiRequest, res: NextApiResponse) {
  const { secret } = req.query;

  if (secret !== process.env.DATA_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const plainClient = await getContentfulPlainClient();

    // Get accessibility features from cloud storage
    const features = await getFeaturesFromStorage();

    // Get existing accessibility feature entries from Contentful
    const entries = await getExistingFeatureEntries(plainClient);

    // Chunk features to concurrently update/create and publish entries but adhere to Contentful Management API rate limits.
    // The current rate limits for this API is 10 api calls per second. As we both create/update and publish an entry (2 api calls),
    // we can use Promise.all to handle 5 features at once.
    const featureChunks = _chunk(features, 5);
    for (const chunk of featureChunks) {
      const minTimeout = 1000;
      const startTime = new Date().getTime();

      let didUpdate = false;

      await Promise.all(
        chunk.map(feature => {
          return new Promise<void>(async resolve => {
            const entry = entries[mapFeatureId(feature.platform.en, feature.featureKey.en, feature.propertyKey.en)];

            // Update or create feature entry
            if (entry) {
              // Only update if it has any changed fields values
              if (!_isEqual(entry.fields, feature)) {
                await updateFeatureEntry(plainClient, feature, entry);
                didUpdate = true;
              }
            } else {
              await createFeatureEntry(plainClient, feature);
              didUpdate = true;
            }

            resolve();
          });
        }),
      );

      // If any actual Contentful creates or updates were executed for this chunk of features,
      // make sure to wait for any leftover time within the rate limit time.
      if (didUpdate) {
        const endTime = new Date().getTime();
        await new Promise(resolve => setTimeout(resolve, Math.max(0, minTimeout - (endTime - startTime))));
      }
    }

    res.status(200).send(`Successfully updated ${features.length} accessibility data features.`);
  } catch (e) {
    console.error('Failed to update Contentful accessibility feature entries.', e);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Imports the contentful management SDK and creates and returns a plain client
 */
async function getContentfulPlainClient(): Promise<PlainClientAPI> {
  // It is important to lazy import the contentful-management package as we only use it here and want to minimize our bundle
  const contentful = await import('contentful-management');

  return contentful.createClient(
    {
      accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string,
    },
    {
      type: 'plain',
      defaults: {
        spaceId: process.env.CONTENTFUL_SPACE_ID as string,
        environmentId: process.env.CONTENTFUL_ENVIRONMENT as string,
      },
    },
  );
}

/**
 * Get existing accessibility feature entries from Contentful mapped as a record of id keys and entry values.
 */
async function getExistingFeatureEntries(client: PlainClientAPI) {
  const entries = await client.entry.getMany<LocalizedFields<IAccessibilityDataFeatureFields>>({
    query: {
      content_type: 'accessibilityDataFeature',
      limit: 1000,
      locale: DEFAULT_LOCALE,
    },
  });

  return entries.items.reduce(
    (all: Record<string, EntryProps<LocalizedFields<IAccessibilityDataFeatureFields>>>, entry) => {
      return {
        ...all,
        [mapFeatureId(entry.fields.platform.en, entry.fields.featureKey.en, entry.fields.propertyKey.en)]: entry,
      };
    },
    {},
  );
}

/**
 * Create accessibility feature entry in Contentful
 */
async function createFeatureEntry(client: PlainClientAPI, feature: LocalizedFields<IAccessibilityDataFeatureFields>) {
  const createdEntry = await client.entry.create(
    {
      contentTypeId: 'accessibilityDataFeature',
    },
    {
      fields: feature,
    },
  );

  await client.entry.publish({ entryId: createdEntry.sys.id }, createdEntry);
}

/**
 * Update existing accessibility feature entry in Contentful
 */
async function updateFeatureEntry(
  client: PlainClientAPI,
  feature: LocalizedFields<IAccessibilityDataFeatureFields>,
  entry: EntryProps<LocalizedFields<IAccessibilityDataFeatureFields>>,
) {
  const updatedEntry = await client.entry.update(
    { entryId: entry.sys.id },
    {
      sys: entry.sys,
      fields: feature,
    },
  );

  await client.entry.publish({ entryId: updatedEntry.sys.id }, updatedEntry);
}

/**
 * Get a list of all accessibility features from an aggregated JSON file in Google Storage.
 */
async function getFeaturesFromStorage(): Promise<LocalizedFields<IAccessibilityDataFeatureFields>[]> {
  // It is important to lazy import the @google-cloud/storage package as we only use it here and want to minimize our bundle
  const { Storage } = await import('@google-cloud/storage');
  const serviceAccount = JSON.parse(process.env.DATA_SA_KEY as string);
  const storage = new Storage({ projectId: process.env.DATA_PROJECT_ID as string, credentials: serviceAccount });
  const file = await storage
    .bucket(process.env.DATA_STORAGE_BUCKET as string)
    .file(process.env.DATA_STORAGE_FILE as string)
    .download();
  const json = JSON.parse(file[0].toString()) as AccessibilityDataAggregationResponse;
  const featuresByPlatform = Object.entries(json);

  return featuresByPlatform.reduce(
    (all: LocalizedFields<IAccessibilityDataFeatureFields>[], [platform, aggregations]) => [
      ...all,
      // Accessibility features
      ...Object.entries(aggregations.features).flatMap(([featureKey, feature]) => {
        return Object.entries(feature).flatMap(([propertyKey, property]) =>
          mapFeatureFields(featureKey, propertyKey, property, platform),
        );
      }),
    ],
    [],
  );
}

function mapFeatureId(platform: string, feature: string, property: string) {
  return `${platform}-${feature}-${property}`;
}

function mapFeatureFields(
  featureKey: string,
  propertyKey: string,
  property: AccessibilityDataPropertyResponse,
  platform: string,
): LocalizedFields<IAccessibilityDataFeatureFields> {
  return {
    internalName: {
      [DEFAULT_LOCALE]: `${_capitalize(platform)} - ${_capitalize(featureKey.replaceAll('_', ' '))} - ${_capitalize(
        propertyKey,
      )}`,
    },
    featureKey: { [DEFAULT_LOCALE]: featureKey },
    propertyKey: { [DEFAULT_LOCALE]: propertyKey },
    platform: { [DEFAULT_LOCALE]: platform },
    amount: { [DEFAULT_LOCALE]: property.amount },
    percentage: { [DEFAULT_LOCALE]: property.percentage },
  };
}
