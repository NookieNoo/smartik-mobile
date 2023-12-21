export const OrderMainStatus = {
  created: {
    name: 'Создан',
    color: '#8E8E93',
  },
  'payment:process': {
    name: 'Создан',
    color: '#8E8E93',
  },
  'payment:done': {
    name: 'Создан',
    color: '#8E8E93',
  },
  'payment:problem': {
    name: 'Создан',
    color: '#FF3B30',
  },
  'delivery:created': {
    name: 'Передан в доставку',
    color: '#8E8E93',
  },
  'delivery:performed': {
    name: 'Заказ в пути',
    color: '#8E8E93',
  },
  'delivery:on_way': {
    name: 'Заказ в пути',
    color: '#8E8E93',
  },
  'delivery:arrived': {
    name: 'Завершен',
    color: '#8E8E93',
  },
  done: {
    name: 'Завершен',
    color: '#38B54D',
  },
  'canceled:user': {
    name: 'Отменен',
    color: '#FF3B30',
  },
  'canceled:driver': {
    name: 'Отменен',
    color: '#FF3B30',
  },
  'canceled:manager': {
    name: 'Отменен',
    color: '#FF3B30',
  },
};

export default OrderMainStatus;
