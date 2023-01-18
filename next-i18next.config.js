const path = require('path');

module.exports = {
  i18n: {
    locales: ['default', 'en', 'nl'],
    defaultLocale: 'default',
  },
  localePath: path.resolve('./locales'),
};
