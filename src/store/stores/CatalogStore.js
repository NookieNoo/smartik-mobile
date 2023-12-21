import { toJS } from 'mobx';
import { flow, types } from 'mobx-state-tree';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import CatalogItem from '../items/CatalogItem';

const CatalogStore = types.compose(
  BaseStore,
  types
    .model({
      loading: false,
      items: types.optional(types.array(CatalogItem), []),
      active: types.maybeNull(types.reference(CatalogItem)),
    })
    .actions((self) => ({
      fetch: flow(function* () {
        self.loading = true;
        const result = yield Http.get('/catalog/list');
        if (result.success) {
          self.items = result.data;
        }
        self.loading = false;
      }),

      setActive(id) {
        self.active = id;
        if (!self.store.product.items.filter((product) => product.catalogs.includes(id)).length) {
          self.store.product.fetch(self.active.uuid);
        }
      },
      setLoading(loading) {
        self.loading = loading;
      },
    }))
    .views((self) => ({
      getSausage() {
        return toJS(
          self.items.find((catalog) => catalog.name.toLowerCase() === 'колбасы, сосиски')
        );
      },
      getCheese() {
        return toJS(self.items.find((catalog) => catalog.name.toLowerCase() === 'сыр'));
      },
      getMilkProducts() {
        return toJS(
          self.items.find((catalog) => catalog.name.toLowerCase() === 'молочная продукция')
        );
      },
      getTech() {
        return toJS(self.items.find((catalog) => catalog.name.toLowerCase() === 'бытовая техника'));
      },
      getChemicals() {
        return toJS(self.items.find((catalog) => catalog.name.toLowerCase() === 'бытовая химия'));
      },
      getFilteredCategories(query) {
        if (query === '') {
          return self.items;
        }
        return toJS(
          self.items.filter((catalog) => catalog.name.toLowerCase().includes(query.toLowerCase()))
        );
      },
    }))
);

export default CatalogStore;
