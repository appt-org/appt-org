# Appt

![Build Status](https://github.com/Q42/Appt/actions/workflows/deploy-acceptance.yml/badge.svg)
![Build Status](https://github.com/Q42/Appt/actions/workflows/deploy-production.yml/badge.svg)

## Table of contents

- [Stack](#stack)
- [Project setup](#project-setup)
- [Environments](#environments)
- [Contentful content modelling](#contentful-content-modelling)
- [Contentful migrations](#contentful-migrations)
- [Release](#release)
- [Commit conventions](#commit-conventions)
- [Code samples and programming languages](#code-samples-and-programming-languages)
- [Accessibility](#accessibility)
- [Icons](#icons)

## Stack

- Next.js
- Typescript
- Tailwind CSS
- Contentful
- Google Cloud Run

## Project setup

1. Install [Node Version Manager](https://github.com/nvm-sh/nvm)
2. Run `nvm i` to install/use the correct node version as described in `.nvmrc`
3. Run `npm i` to install all dependencies
4. Copy all `.env` files from 1Password `Team Appt` vault and paste it in the root of the project
5. Configure and use prettier and editor config in your IDE of choice to conform to the project formatting rules
6. Run `npm run dev` to start development server

To run a production-like build:

- Run `npm run build:production`
- Run `npm run start`

## Environments

The Next.js server is hosted on Google Cloud Platform and Cloud Run as a docker container. A new version will be
automatically deployed to GCP with commits on specific branches, outlined below.

### Acceptance

- **URL**: https://appt-acceptance-o4ale4roda-ez.a.run.app
- **Branch**: develop

### Production

- **URL**: https://appt-production-o4ale4roda-ez.a.run.app
- **Branch**: main

## Release

1. Create a release branch (e.g.`release/v1.0.1`)
2. Create a tag based on this release branch (e.g. `v1.0.1`)
3. Make sure you followed the steps in [Releasing a feature with new or updated content models](#releasing-a-feature-with-new-or-updated-content-models) if any changes were made to the content models
4. Merge release branch to main
   - This creates an auto deploy to production
   - In Cloud Run a new revision will be available in [`appt-production`](https://console.cloud.google.com/run/detail/europe-west4/appt-production/revisions?project=appt-org)
5. Release and swap: **!important! these steps must be performed at the same time**:
   - Click on the Actions menu in the revisions, and manage traffic to put the new changes live
   - **Only needed if migrations are applied**: Go to Settings > Environments > Change alias target and select the new environment
6. Publish a new release in Github based on the tag
7. Merge `main` back to `develop`

### Hotfixes

When creating a hotfix on a release that's not merged yet: create a hotfix branch from the release branch, merge into
the release. When creating a hotfix for production: create a hotfix branch from master, go to release steps again to
create a new release for this fix.

## Contentful content modelling

Adding a new Contentful content type requires a few steps:

- In Contentful > Content Model > Add content type
- Configure your content type model and fields
- Run `npm run generate-types` in the root of the project to automatically create Typescript models for your created
  content type
- Add an api model type for your created content type in `api-types.ts`
- Add relevant mappers and render logic in `contentful-mapper.ts` and in your components

For pages:

- Add required page fields like SEO, slug, page title etc.
- Make sure to select the created page type as a Compose page through Compose > Page types > Select content type
- Add a mapper to the `mapPage` function in `contentful-mapper.ts`
- Handle page component rendering in `PageHandler.tsx` by importing the component and return it in the switch case

## Contentful migrations

In Contentful we use multiple environments, to make sure we can edit content for local development without breaking the
content in production. The environment that is set as an alias for `master` is the production branch. The `acceptance`
branch is used for the acceptance environment and for local development when making changes that don't touch the content
models.

### Building a feature with new or updated content models

- Create a new feature environment in Contentful
  - Go to Settings > Environments > Add environment
  - Go to Settings > API Keys > Appt Development > Select your environment to give access
- Update your `.env.development` with the correct `CONTENTFUL_ENVIRONMENT`
- Create a migration script to update `acceptance` and `master` later on with the content model changes

### Merging a feature with new or updated content models

When merging a PR with a migration script, run this script against `acceptance` to update the acceptance environment.
Check if everything still works and update migration scripts if needed.

### Releasing a feature with new or updated content models

When releasing features with one or multiple migration scripts, we follow the following steps to make sure production
doesn't break and we always have a content back-up:

1. Create a new Contentful environment, cloned from the current master alias
   - Go to Settings > Environments > Add environment
2. Run the new migration scripts on this new environment
   - `contentful space use --space-id $SPACE_ID`
   - `contentful space migration --environment-id $ENVIRONMENT_ID $PATH_TO_FILE`
3. Check your CLI and Contentful to see if there's any errors
4. Checkout the release locally with the new environment, to see if everything still works
   - Go to Settings > API Keys > Appt Production > Select your environment to give access
   - Update the `.env.production` with the correct `CONTENTFUL_ENVIRONMENT`
   - Run `npm run build:production && npm run start`

_See the [Scripting Migrations docs](https://www.contentful.com/developers/docs/tutorials/cli/scripting-migrations/) for
creating and running migration scripts_

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) to write clear and readable commit
messages.

## Code samples and programming languages

We use [Prism](https://prismjs.com/) for syntax highlighting in the code samples on the site. To use the correct
highlighting we need to set the language, we have a hardcoded list
of [supported languages](https://prismjs.com/#supported-languages) in contentful and our babel config, so we don't have
to load all languages from Prism. To add a new language to the config:

- Get the language from Prism [supported languages](https://prismjs.com/#supported-languages)
- In contentful > content model > programming language > Prism language > validation > add the new value to the accepted values
- In `.babelrc` add the value to Prism languages

## Accessibility

### Font scaling and using REM

To make sure users that change their default font-size in the browser are still able to use Appt we make sure we support
font scaling.

**Don't**

- Don't use fixed widths or heights on components, so the containers can grow with the font size.
- Don't use a fixed width and height on svg's.
- Don't use REM for line heights, this will result in mega line heights on Safari.

**Do**

- Use the viewBox on svg's with a width and height class in REM's.
- Use REM's for font sizes, paddings, margins, media queries and images that should grow when the text grows, for
  example logo's.

_Note: We decided to not use `font: -apple-system-body;` for scaling text on mobile iOS devices. You can already set a
default zoom level in the Safari preferences. We assume that people have this turned on. If we also turn on font scaling
on iOS, users suddenly get an extra large font._

## Icons

We use the `@svgr/webpack` plugin to use `svg` icons in our project. To add a new icon:

1. Export an SVG icon with 32x32px dimensions and with 8px padding
2. Optimize the SVG using https://jakearchibald.github.io/svgomg/
3. Save it as `./icons/icon-[NAME].svg`
4. Open the SVG code and replace any hardcoded color values with `currentColor`
5. Export the icon through `./icons/index.ts`
