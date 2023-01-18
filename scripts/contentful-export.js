const execSync = require('child_process').execSync;

const date = new Date().toISOString().split('T')[0];

execSync(
  `contentful space export --space-id=${process.env.CONTENTFUL_SPACE_ID} --environment-id=${process.env.CONTENTFUL_ENVIRONMENT} --management-token=${process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN} --content-only=true --export-dir=./scripts/exports --content-file=export-${date}.json --max-allowed-limit=100 --use-verbose-renderer=true`,
);
