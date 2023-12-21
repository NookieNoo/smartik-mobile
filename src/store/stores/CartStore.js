import { observable } from 'mobx';
import { flow, types } from 'mobx-state-tree';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';

const CartStore = types.compose(
  BaseStore,
  types
    .model({
      delivery: types.maybeNull(
        types.model({
          possible: 0,
          free: 0,
          price: 0,
        })
      ),
      delivery_at: '',
      delivery_time: types.array(types.array(types.integer)),
      loading: false,
      created_at: '',
      sum_products: 0,
      delivery_price: 0,
      promo_discount: 0,
      sum_final: 0,
      promos: types.optional(
        types.array(
          types.model({
            name: '',
            code: '',
            type: types.enumeration(['value', 'percent', 'delivery']),
            discount: 0,
            from_sum: 0,
          })
        ),
        []
      ),
      products: types.optional(
        types.array(
          types.model({
            uuid: '',
            uuid_price: '',
            name: '',
            price: 0,
            count: 0,
            available_count: 0,
            limit: 0,
            discount: 0,
            discount_percent: 0,
            days_left: 0,
            days_left_percent: 0,
            expired_at: '',
            is_deleted: false,
          })
        ),
        []
      ),
    })
    .volatile((self) => ({
      promo: observable({
        loading: false,
        error: '',
        data: {},
      }),
      count: observable({
        loading: false,
        uuid: '',
        error: '',
      }),
    }))
    .actions((self) => ({
      setData(data) {
        self.update(data);
      },
      info: flow(function* () {
        const result = yield Http.get('/cart/info');
        if (result.success) {
          const checkAvailable = yield Http.get('/cart/check');
          const errCount = checkAvailable.error?.data?.length ? checkAvailable.error.data : [];

          result?.data?.products?.map((product) => {
            const check = errCount?.find(
              (error) => error.product_price_uuid === product.uuid_price
            );
            product.available_count = check ? check.count : product.count;
          });

          self.setData(result.data);
        }
      }),
      setPromo: flow(function* setPromo(code) {
        self.promo.loading = true;
        self.promo.error = '';
        const result = yield Http.post('/cart/promo', { code });
        self.promo.loading = false;
        if (!result.success) {
          self.promo.error = result.error?.data?.type;
          self.promo.data = result.error?.data?.additional;
          return false;
        }
        self.update(result.data);
        return true;
      }),
      removePromo: flow(function* () {
        self.promo.loading = true;
        const result = yield Http.delete('/cart/promo');
        self.promo.loading = false;
        if (result.success) {
          self.update(result.data);
        }
      }),
      setPromoError(error) {
        self.promo.error = typeof error === 'string' ? error : '';
      },
      changeCount: flow(function* (price_uuid, count, loading = true) {
        self.count.loading = loading;
        self.count.error = '';
        self.count.uuid = price_uuid;
        const result = yield Http.post('/cart/change_count/' + price_uuid, {
          count,
        });
        if (result.success) {
          const checkAvailable = yield Http.get('/cart/check');
          const errCount = checkAvailable.error?.data?.length ? checkAvailable.error.data : [];

          result?.data?.products?.map((product) => {
            const check = errCount?.find(
              (error) => error.product_price_uuid === product.uuid_price
            );
            product.available_count = check ? check.count : product.count;
          });

          self.setData(result.data);
        } else {
          self.count.error = result.error?.message;
          return false;
        }
        self.count.loading = false;
        return true;
      }),
      clear: flow(function* () {
        const result = yield Http.delete('/cart');
        if (result.success) {
          self.reset();
        }
      }),
    }))
    .views((self) => ({
      get getProducts() {
        return self.products.slice();
      },
      get availableCount() {
        console.log(self.available_count);
        return self.available_count !== -1 ? self.available_count : true;
      },
      get sumProducts() {
        let sum = 0;
        self.products
          .filter((product) => !product.is_deleted)
          .map((product) => {
            if (product.is_deleted) return;
            sum = sum + product.count * product.price;
          });
        return sum;
      },
      get sumDiscount() {
        let sum = 0;
        self.products
          .filter((product) => !product.is_deleted)
          .map((product) => {
            if (product.is_deleted) return;
            sum = sum + product.count * product.discount;
          });
        return sum;
      },
      get sumProductsFull() {
        let sum = 0;
        self.products
          .filter((product) => !product.is_deleted)
          .map((product) => {
            if (product.is_deleted) return;
            sum = sum + product.count * (product.price + product.discount);
          });
        return sum;
      },
      get promoError() {
        //console.log('self.promo.data', self.promo.data)
        switch (self.promo.error) {
          case 'no sum': {
            return (
              'Для применения этого промокода, добавьте в корзину продуктов на сумму ' +
              self.promo.data.need +
              '₽'
            );
          }
          case 'active': {
            return 'Промокод не активен';
          }
          case 'only_for_first_order': {
            return 'Промокод только для первого заказа';
          }
          case 'late': {
            return 'Закончился срок годности промокода';
          }
          default: {
            return 'Промокод не найден';
          }
        }
      },
      get getTotalCount() {
        let totalCount = 0;
        self.products.forEach((product) => {
          totalCount = totalCount + product.count;
        });
        return totalCount;
      },
      get getTotalPercent() {
        return (1 - self.sum_products / this.sumProductsFull) * 100;
      },

      isDisabledButton({ uuid, count, limit, type }) {
        if (self.count.loading && self.count.uuid === uuid) return true;
        if (type === 'plus' && count >= limit) return true;
        if (type === 'minus' && count <= 0) return true;
        return false;
      },

      get deliveryStatus() {
        const sum = self.sumProducts;

        return {
          count: self.products.filter((product) => !product.is_deleted).length,
          possible: sum >= self.delivery.possible,
          free: sum >= self.delivery.free,
          need:
            sum >= self.delivery.possible ? self.delivery.free - sum : self.delivery.possible - sum,
          price: sum >= self.delivery.free ? 0 : self.delivery.price,
        };
      },
    }))
);

export default CartStore;
