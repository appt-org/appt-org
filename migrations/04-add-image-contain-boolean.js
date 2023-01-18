module.exports = function (migration) {
  const image = migration.editContentType('image');

  image.createField('contain').name('Display in original width/height').type('Boolean').localized(false).defaultValue({
    en: false,
  });
  image.changeFieldControl('contain', 'builtin', 'boolean', {
    helpText: `Images are displayed full width by default. Choose "Yes" to display the image in it's original size.`,
  });
};
