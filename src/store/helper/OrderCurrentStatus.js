export const OrderCurrentStatus = {
  created: {
    name: 'Оформлен',
    index: 0,
  },
  'payment:process': {
    name: 'Оформлен',
    index: 0,
  },
  'payment:done': {
    name: 'Собираем заказ',
    index: 1,
  },
  'payment:problem': {
    name: 'Оформлен',
    index: 0,
  },
  'delivery:created': {
    name: 'Передан в доставку',
    index: 2,
  },
  'delivery:performed': {
    name: 'Заказ у курьера',
    index: 2,
  },
  'delivery:on_way': {
    name: 'Заказ в пути',
    index: 3,
  },
  'delivery:arrived': {
    name: 'Доставлен',
    index: 4,
  },
  done: {
    name: 'Доставлен',
    index: 4,
  },
  'canceled:user': {
    name: 'Доставлен',
    index: -1,
  },
  'canceled:driver': {
    name: 'Доставлен',
    index: -1,
  },
  'canceled:manager': {
    name: 'Доставлен',
    index: -1,
  },
};

export default OrderCurrentStatus;
