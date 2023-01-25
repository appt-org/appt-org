# Appt.org
*Source code of appt.org*

![Build Status](https://github.com/appt-org/appt-org/actions/workflows/deploy-acceptance.yml/badge.svg)
![Build Status](https://github.com/appt-org/appt-org/actions/workflows/deploy-production.yml/badge.svg)

**What is Appt?**

The Appt® platform is an initiative of the Appt Foundation, a non-profit organization. Our mission is to make apps accessible for everyone. We try to achieve this by sharing free knowledge and open-source code. Appt.org is a website that empowers developers and organizations to build accessible apps for everyone.

<details>
<summary>Table of contents</summary>

- [Stack](#stack)
- [Local development](#local-development)
- [Environments](#environments)
- [Commit conventions](#commit-conventions)
- [Accessibility](#accessibility)
- [License](#license)
</details>


## Stack

- Next.js
- Typescript
- Tailwind CSS
- Contentful
- Google Cloud Run

## Local development
Local development for Appt is not supported right now. Some secrets, like API keys, are needed to make a connection with Contentful for the content of the website. For more on local development see [docs on local development](./documentation/local-development.md).

## Environments

The Next.js server is hosted on Google Cloud Platform and Cloud Run as a docker container. A new version will be
automatically deployed to GCP with commits on specific branches, outlined below.

### Acceptance

- **URL**: https://appt-acceptance-o4ale4roda-ez.a.run.app
- **Branch**: develop

### Production

- **URL**: https://appt.org
- **Branch**: main


## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) to write clear and readable commit
messages.

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

## License
The source code is available under the MIT license. See the [LICENSE file](./LICENSE) for more information.
