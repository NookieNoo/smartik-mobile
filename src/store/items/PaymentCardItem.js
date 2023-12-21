import { types } from 'mobx-state-tree';

const PaymentCardItem = types.model({
  CardId: types.string,
  Pan: types.string,
  Status: types.string,
  RebillId: types.string,
  CardType: types.integer,
  ExpDate: types.string,
  isMain: types.boolean,
});

export default PaymentCardItem;
