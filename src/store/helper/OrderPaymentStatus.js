export const OrderPaymentStatus = {
  created: {
    name: 'Ожидает оплаты',
    color: '#8E8E93',
  },
  'payment:process': {
    name: 'Ожидает оплаты',
    color: '#8E8E93',
  },
  'payment:done': {
    name: 'Оплачен',
    color: '#8E8E93',
  },
  'payment:problem': {
    name: 'Проблема с оплатой',
    color: '#FF3B30',
  },
  'delivery:created': {
    name: 'Оплачен',
    color: '#8E8E93',
  },
  'delivery:performed': {
    name: 'Оплачен',
    color: '#8E8E93',
  },
  'delivery:on_way': {
    name: 'Оплачен',
    color: '#8E8E93',
  },
  'delivery:arrived': {
    name: 'Оплачен',
    color: '#8E8E93',
  },
  done: {
    name: 'Выполнен',
    color: '#38B54D',
  },
  'canceled:user': {
    name: '',
    color: '#FF3B30',
  },
  'canceled:driver': {
    name: '',
    color: '#FF3B30',
  },
  'canceled:manager': {
    name: '',
    color: '#FF3B30',
  },
};

export default OrderPaymentStatus;
