module.exports = function (migration) {
  const pages = ['pageContentPage', 'pageHomePage', 'pageObjectPage', 'pageGuidelinePage'];
  for (const page of pages) {
    pageContentType = migration.editContentType(page);
    pageContentType
      .createField('platformFilter')
      .name('Code platform filter')
      .type('Link')
      .linkType('Entry')
      .validations([
        {
          linkContentType: ['platform'],
        },
      ]);

    pageContentType.moveField('platformFilter').afterField('showPageDate');
  }
};
