module.exports = function (migration) {
  // Create a new number field in the percentage block.
  const percentageBlock = migration.editContentType('percentageBlock');
  percentageBlock.createField('baseValue').name('Base value').type('Number');
  percentageBlock.moveField('baseValue').afterField('text');
};
