import { flow, types } from 'mobx-state-tree';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import PaymentCardItem from '../items/PaymentCardItem';

const PaymentCardStore = types.compose(
  BaseStore,
  types
    .model({
      items: types.optional(types.array(PaymentCardItem), []),
    })
    .volatile((self) => ({
      loading: false,
      error: '',
    }))
    .actions((self) => ({
      setData(data) {
        self.items = data;
      },

      loadCards: flow(function* setPromo(code) {
        self.loading = true;
        self.error = '';
        const result = yield Http.get('/profile/payment_cards');
        if (result.success) {
          self.setData(result.data);
        }
        self.loading = false;
      }),
      removeCardById: flow(function* removeCard(id) {
        self.loading = true;
        self.error = '';
        // const result = yield Http.delete(`/profile/card${id}`);
        const result = {success: true}
        if (result.success) {
          const activeCards = self.items.filter(it => it.CardId !== id);
          self.setData(activeCards);
        }
        self.loading = false;
      }),
    }))
);

export default PaymentCardStore;
