import { NextApiRequest, NextApiResponse } from 'next';
import { isProd } from 'shared/utils/env';

export default async function robots(req: NextApiRequest, res: NextApiResponse) {
  const allow = !isProd() ? '' : 'Allow: /*';
  const disallow = !isProd() ? 'Disallow: /*' : 'Disallow: /api/*';

  res.send(`\
User-agent: *
${disallow}
${allow}
`);
}
