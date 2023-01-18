const BASE_GRAPHQL_URL = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}`;

export async function fetchGraphQL<T>(query: string, variables: Record<string, any>, preview = false): Promise<T> {
  const response = await fetch(BASE_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${
        preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
      }`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        ...variables,
        preview,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Contentful GraphQL data. Status: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as unknown as T;
}
