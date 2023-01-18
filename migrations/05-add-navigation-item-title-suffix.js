module.exports = function (migration) {
  const navigationItem = migration.editContentType('navigationItem');

  navigationItem.createField('titlePrefix').name('Title prefix').type('Symbol').localized(true);
  navigationItem.moveField('titlePrefix').afterField('title');
};
