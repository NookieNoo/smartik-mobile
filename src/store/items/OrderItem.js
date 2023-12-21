import { types } from 'mobx-state-tree';
import CartStore from '../stores/CartStore';

const OrderItem = types
  .model({
    uuid: types.maybeNull(types.identifier),
    name: types.maybeNull(types.string),
    status: types.maybeNull(types.string),
    sum_products: 0,
    delivery_price: types.maybeNull(types.integer),
    promo_discount: types.maybeNull(types.integer),
    sum_final: 0,
    comment: types.maybeNull(types.string),
    done_at: types.maybeNull(types.string),
    delivery_at: types.maybeNull(types.string),
    delivery_change_at: types.maybeNull(types.string),
    cart: types.maybeNull(CartStore),
  })
  .actions((self) => ({}));

export default OrderItem;
