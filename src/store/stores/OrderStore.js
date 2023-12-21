import { flow, types } from 'mobx-state-tree';

import BaseStore from '../BaseStore';
import OrderItem from '../items/OrderItem';
import Http from '../../initialize/Http';

const OrderStore = types.compose(
  BaseStore,
  types
    .model('OrderStore', {
      loading: false,
      current: types.maybeNull(OrderItem),
      items: types.optional(types.array(OrderItem), []),
      completedOrders: types.maybeNull(types.integer),
    })
    .actions((self) => ({
      fetch: flow(function* () {
        self.setLoading(true);
        const result = yield Http.get('/order/list');
        if (result.success) {
          self.setItems(result.data);
        }
        self.setLoading(false);
      }),

      setLoading(data) {
        self.loading = data;
      },
      setItems(items) {
        self.items = items;
      },
      setCurrent(item) {
        self.current = item;
      },
      setCompletedOrdersNumber(item) {
        self.completedOrders = item;
      },
    }))
    .views((self) => ({
      countActive() {
        return self.items.filter();
      },
    }))
);

export default OrderStore;
