const loadEnvConfig = require('@next/env').loadEnvConfig;
const contentfulManagement = require('contentful-management');

module.exports = function () {
  loadEnvConfig(process.cwd());

  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
  });

  return contentfulClient
    .getSpace(process.env.CONTENTFUL_SPACE_ID)
    .then(space => space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT));
};
