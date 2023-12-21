import { types } from 'mobx-state-tree';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import ProductItem from '../items/ProductItem';
import dayjs from 'dayjs';
import SlideBannerItem from '../items/SlideBannerItem';

const HomeCategoriesStore = types.compose(
  BaseStore,
  types
    .model({
      discountProducts: types.optional(types.array(ProductItem), []),
      recommendProducts: types.optional(types.array(ProductItem), []),
      fiveDaysProducts: types.optional(types.array(ProductItem), []),
      fifteenDaysProducts: types.optional(types.array(ProductItem), []),
      bigDueDateProducts: types.optional(types.array(ProductItem), []),
      cheeseProducts: types.optional(types.array(ProductItem), []),
      sausageProducts: types.optional(types.array(ProductItem), []),
      milkProducts: types.optional(types.array(ProductItem), []),
      notProducts: types.optional(types.array(ProductItem), []),
      slideBanners: types.optional(types.array(SlideBannerItem), []),
    })
    .volatile((self) => ({
      loading: false,
      refreshLoading: false,
    }))
    .actions((self) => ({
      async fetchAll() {
        this.fetchDiscount();
        this.fetchRecommend();
        this.fetchFiveDays();
        this.fetchFifteenDays();
        this.fetchBigDateProducts();
        this.fetchCheeseProducts();
        this.fetchSausageProducts();
        this.fetchMilkProducts();
        this.fetchNotProducts();
      },
      async fetchDiscount() {
        self.setLoading(true);
        const result = await Http.get('/product?limit=8&offset=1&order=discount');
        if (result.success) {
          self.setDiscountProducts(result.data);
        }
        self.setLoading(false);
      },

      async fetchRecommend() {
        self.setLoading(true);
        const result = await Http.get('/product/recommended');
        if (result.success) {
          self.setRecommendProducts(result.data);
        }
        self.setLoading(false);
      },

      async fetchFiveDays() {
        this.setLoading(true);
        const result = await Http.get('/product?limit=8&offset=1&order=expired_at');
        if (result.success) {
          this.setFiveDays(result.data);
        }
        this.setLoading(false);
      },

      async fetchFifteenDays() {
        this.setLoading(true);
        const plusDays = dayjs().add(15, 'days').format('YYYY-MM-DD');
        const result = await Http.get(
          `/product?limit=8&offset=1&expired_at_from=${plusDays}&order=expired_at`
        );
        if (result.success) {
          this.setFifteenDays(result.data);
        }
        this.setLoading(false);
      },

      async fetchBigDateProducts() {
        this.setLoading(true);
        const result = await Http.get(`/product?limit=8&offset=1&order=-expired_at`);
        if (result.success) {
          this.setBigDateProducts(result.data);
        }
        this.setLoading(false);
      },

      async fetchCheeseProducts() {
        self.setLoading(true);
        const result = await Http.get('/catalog/b194fe2f-d98d-47b5-99ff-ff5b097da8d0/products');
        if (result.success) {
          this.setCheeseProducts(result.data.items.slice(0, 8));
        }
        self.setLoading(false);
      },
      async fetchSausageProducts() {
        self.setLoading(true);
        const result = await Http.get('/catalog/f06c3d35-5273-42f1-a594-4fa4b0e78eb6/products');
        if (result.success) {
          this.setSausageProducts(result.data.items.slice(0, 8));
        }
        self.setLoading(false);
      },
      async fetchMilkProducts() {
        self.setLoading(true);
        const result = await Http.get('/catalog/d4a1cb84-5487-432a-96e7-51dbd5c9f574/products');
        if (result.success) {
          this.setMilkProducts(result.data.items.slice(0, 8));
        }
        self.setLoading(false);
      },
      async fetchNotProducts() {
        self.setLoading(true);
        const result = await Http.get('/catalog/a2a8201d-0bb0-4321-b4ec-54e11c56d673/products');
        if (result.success) {
          this.setNotProducts(result.data.items.slice(0, 8));
        }
        self.setLoading(false);
      },
      async fetchSlideBanners() {
        self.setLoading(true);
        const result = await Http.get('/banner');
        if (result.success) {
          this.setSlideBanners(result.data.filter((item) => item.location === 'home_header'));
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
      setDiscountProducts(items) {
        self.discountProducts = items;
      },
      setRecommendProducts(items) {
        self.recommendProducts = items;
      },
      setFiveDays(items) {
        self.fiveDaysProducts = items;
      },
      setFifteenDays(items) {
        self.fifteenDaysProducts = items;
      },
      setBigDateProducts(items) {
        self.bigDueDateProducts = items;
      },
      setCheeseProducts(items) {
        self.cheeseProducts = items;
      },
      setSausageProducts(items) {
        self.sausageProducts = items;
      },
      setMilkProducts(items) {
        self.milkProducts = items;
      },
      setNotProducts(items) {
        self.notProducts = items;
      },
      setSlideBanners(items) {
        self.slideBanners = items;
      },
    }))
    .views((self) => ({}))
);

export default HomeCategoriesStore;
