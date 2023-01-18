module.exports = function (migration) {
  // Create a new anchor field in the link content type.
  const link = migration.editContentType('link');
  link.createField('anchor').name('Anchor').type('Symbol').localized(true);
  link.moveField('anchor').afterField('externalUrl');
  link.changeFieldControl('anchor', 'builtin', 'singleLine', {
    helpText: 'This is an experimental feature and can be disabled in the future. Do not include the # tag.',
  });
};
