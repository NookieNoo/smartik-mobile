const OrderStatus = {
  created: {
    name: 'Создан:Ожидает оплаты:Заказ ожидает оплаты',
    color: '#8E8E93',
  },
  'payment:process': {
    name: 'Создан:Ожидает оплаты:Заказ ожидает оплаты',
    color: '#8E8E93',
  },
  'payment:done': {
    name: 'Активный:Оплачен:Заказ в сборке',
    color: '#8E8E93',
  },
  'payment:problem': {
    name: 'Создан:Проблема с оплатой:Проблема с оплатой',
    color: '#FF3B30',
  },
  'delivery:created': {
    name: 'Активный:Передан в доставку:Передан в доставку',
    color: '#8E8E93',
  },
  'delivery:performed': {
    name: 'Активный:У курьера:Заказ у курьера',
    color: '#8E8E93',
  },
  'delivery:on_way': {
    name: 'Активный:В пути:Заказ в пути',
    color: '#8E8E93',
  },
  'delivery:arrived': {
    name: 'Активный:По адресу:Заказ прибыл',
    color: '#8E8E93',
  },
  done: {
    name: 'Завершен:Заказ завершен',
    color: '#38B54D',
  },
  'canceled:user': {
    name: 'Отменен:Заказ отменен',
    color: '#FF3B30',
  },
  'canceled:driver': {
    name: 'Отменен:Заказ отменен',
    color: '#FF3B30',
  },
  'canceled:manager': {
    name: 'Отменен:Заказ отменен',
    color: '#FF3B30',
  },
};

export default OrderStatus;
