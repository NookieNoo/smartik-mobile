import { types } from 'mobx-state-tree';
import { formatPrice } from '../../config/helper';

const ProductItem = types
  .model({
    name: types.string,
    uuid: types.string,
    compound: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    catalogs: types.array(types.string),
    prices: types.array(
      types.model({
        uuid: types.string,
        price: types.number,
        price_old: types.number,
        count: types.number,
        discount_percent: types.number,
        discount: types.maybeNull(types.number),
        expired_at: types.maybeNull(types.string),
      })
    ),
    weight: types.maybeNull(types.number),
    weight_type: types.maybeNull(types.string),
    energy: types.maybeNull(
      types.model({
        calories: types.maybeNull(types.number),
        carbon: types.maybeNull(types.number),
        fat: types.maybeNull(types.number),
        protein: types.maybeNull(types.number),
      })
    ),
    is_deleted: true,
  })
  .views((self) => ({
    get firstPrice() {
      if (!self.prices.length)
        return {
          price: formatPrice(0),
          full: formatPrice(0),
          count: 0,
          uuid: '',
          discount_percent: 0,
          expired_at: null,
        };

      return {
        price: formatPrice(self.prices[0].price),
        full: formatPrice(self.prices[0].price + self.prices[0].discount),
        count: self.prices[0].count,
        uuid: self.prices[0].uuid,
        discount_percent: self.prices[0].discount_percent,
        expired_at: self.prices[0].expired_at,
      };
    },
    get numberPrice() {
      return {
        newPrice: self.prices[0].price,
        oldPrice: self.prices[0].price + self.prices[0].discount,
      };
    },
  }));

export default ProductItem;
