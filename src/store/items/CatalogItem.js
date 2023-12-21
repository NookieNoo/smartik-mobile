import { types } from 'mobx-state-tree';

const CatalogItem = types.model({
  name: types.string,
  uuid: types.identifier,
  media_uuid: types.maybeNull(types.string),
  children: types.array(types.late(() => CatalogItem)),
});

export default CatalogItem;
