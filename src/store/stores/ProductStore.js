import { toJS } from 'mobx';
import { types } from 'mobx-state-tree';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import ProductItem from '../items/ProductItem';
import sleep from '../../component/sleep';
import dayjs from 'dayjs';
import { orderBy, sampleSize } from 'lodash';

const ProductStore = types.compose(
  BaseStore,
  types
    .model({
      items: types.optional(types.array(ProductItem), []),
      products: types.optional(types.array(ProductItem), []),
      searchProducts: types.optional(types.array(ProductItem), []),
      catalogProducts: types.optional(types.array(ProductItem), []),
    })
    .volatile((self) => ({
      loading: false,
      refreshLoading: false,
      product_loading: false,
    }))
    .actions((self) => ({
      async fetch(catalog, refresh = false) {
        self.setLoading(true);
        if (refresh) self.setRefreshLoading(true);
        await sleep(500);
        const result = await Http.get('/catalog/' + catalog + '/products');
        if (result.success) {
          self.setItems(result.data.items);
        }
        self.setLoading(false);
        self.setRefreshLoading(false);
      },

      async searchFetch(query) {
        self.setLoading(true);
        const result = await Http.post('/product/search', { query });
        if (result.success) {
          this.setSearchProducts(result.data);
        }
        self.setLoading(false);
      },

      setItems(items) {
        self.items = items;
      },

      setProducts(items) {
        self.products = items;
      },

      setLoading(loading) {
        self.loading = loading;
      },
      setRefreshLoading(loading) {
        self.refreshLoading = loading;
      },
      setProductLoading(loading) {
        self.product_loading = loading;
      },
      setSearchProducts(items) {
        self.searchProducts = items;
      },
      setCatalogProducts(items) {
        self.catalogProducts = items;
      },
    }))
    .views((self) => ({
      get getItems() {
        return toJS(self.items);
      },
      async getItemsByCatalog(catalogId) {
        self.setLoading(true);
        const result = await Http.get(`/catalog/${catalogId}/products`);
        if (result.success) {
          self.setCatalogProducts(result.data.items);
        }
        self.setLoading(false);
      },

      getProductsWithNDaysOrLessLeft(days = 5, limit = 8) {
        let list = self.products.filter((item) => {
          const prices = item.prices[0];
          const diff = dayjs(prices.expired_at).diff(dayjs(), 'day');
          return diff <= days;
        });
        list = sampleSize(list, limit);

        return toJS(list);
      },

      getProductsWithDiscount(discount = 50, limit = 8) {
        let list = self.products.filter((item) => {
          return item.prices[0].discount_percent > discount;
        });
        list = orderBy(list, 'prices[0].discount_percent', 'desc').slice(0, limit);

        return toJS(list);
      },

      getProductsWithNMonthOrMoreLeft(months = 1, limit = 8) {
        let list = self.products
          .filter((item) => {
            const prices = item.prices[0];
            const diff = dayjs(prices.expired_at).diff(dayjs(), 'month');
            return diff >= months;
          })
          .slice(0, limit);
        list = sampleSize(list, limit);

        return toJS(list);
      },

      getProductsByCatalog(catalog, limit = 8) {
        let list = self.products.filter((product) => product.catalogs.includes(catalog));
        list = sampleSize(list, limit);

        return toJS(list);
      },

      productListOld(catalog) {
        const tmp = [];
        catalog.map((_catalog) => {
          tmp.push({
            uuid: _catalog.uuid,
            name: _catalog.name,
            products: [],
          });
          const data = self.items.filter((_product) => _product.catalogs.includes(_catalog.uuid));
          if (data.length) {
            tmp[tmp.length - 1].products = data;
          }
        });

        const result = [];

        tmp.map((_data) => {
          if (_data.products.length) {
            result.push({ type: 'sticky', name: _data.name });
            result.push({ type: 'blank' });
            result.push({ type: 'blank' });

            _data.products.map((_product) => {
              result.push({ type: 'product', data: _product.name });
            });

            const roundThird = Math.ceil(_data.products.length / 3) * 3 - _data.products.length;
            for (let i = 0; i < roundThird; i++) {
              result.push({ type: 'blank' });
            }
          }
        });

        return result;
      },
    }))
);

export default ProductStore;
