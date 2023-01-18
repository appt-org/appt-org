import _sortBy from 'lodash/sortBy';
import _sortedUniqBy from 'lodash/sortedUniqBy';

import { ObjectPageApiModel, PropertyApiModel, RelatedObjectPageApiModel } from 'shared/api/api-types';

export function getRelatedObjectPageProperties(page: ObjectPageApiModel) {
  const relatedProperties = [
    ...(page.parentObject ? getObjectPageProperties(page.parentObject) : []),
    ...(page.implementedObjects ? page.implementedObjects.flatMap(obj => getObjectPageProperties(obj)) : []),
  ];

  const ascProperties = _sortBy(relatedProperties, prop => prop.text);
  return _sortedUniqBy(ascProperties, prop => prop.id);
}

function getObjectPageProperties(object: RelatedObjectPageApiModel) {
  const properties: PropertyApiModel[] = object.properties;

  if (object.parentObject) {
    properties.push(...getObjectPageProperties(object.parentObject));
  }

  if (object.implementedObjects) {
    properties.push(...object.implementedObjects.flatMap(obj => getObjectPageProperties(obj)));
  }

  return properties;
}
