import AsyncStorage from '@react-native-async-storage/async-storage';
import { flow, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import messaging from '@react-native-firebase/messaging';
import sleep from '../../component/sleep';
import dayjs from 'dayjs';

const Address = types.model('Address', {
  uuid: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  default: types.maybeNull(types.boolean),
  address: types.maybeNull(types.string),
  address_full: types.maybeNull(types.string),
  address_location: types.model({
    lng: types.number,
    lat: types.number,
  }),
  flat: types.maybeNull(types.string),
  entrance: types.maybeNull(types.string),
  floor: types.maybeNull(types.string),
});

const UserStore = types.compose(
  BaseStore,
  types
    .model('UserStore', {
      loading: false,
      uuid: types.maybeNull(types.string),
      name: types.maybeNull(types.string),
      sex: types.maybeNull(types.enumeration(['man', 'woman'])),
      phone: types.maybeNull(types.string),
      token: types.maybeNull(types.string),
      email: types.maybeNull(types.string),
      birthday_at: types.maybeNull(types.string),
      addresses: types.optional(types.array(Address), []),
      personal_promocodes: types.maybeNull(
        types.model({
          delivery: types.maybeNull(types.string),
          money: types.maybeNull(types.string),
        })
      ),
      showLanding: types.maybeNull(types.string),
      media_source: types.maybeNull(types.string),
    })
    .actions((self) => ({
      getToken: flow(function* () {
        const uuid = yield AsyncStorage.getItem('uuid');
        const token = yield AsyncStorage.getItem('token');
        const showLanding = yield AsyncStorage.getItem('showLanding');
        self.set({ uuid, token, showLanding }, false);
        yield AsyncStorage.setItem('showLanding', 'shown');
      }),
      set: flow(function* (data, setToken = true) {
        Object.entries(data).map(([key, value]) => {
          if (self.hasOwnProperty(key)) {
            self[key] = value;
          }
        });
        if (data.token && setToken) {
          yield AsyncStorage.setItem('uuid', data.uuid);
          yield AsyncStorage.setItem('token', data.token);
        }
        if (data.cart) {
          self.store.cart.info(data.cart);
        } else {
          self.store.cart.reset();
        }

        if (data.orders) {
          self.store.order.setCompletedOrdersNumber(
            data.orders.filter((el) => el.status === 'done').length
          );
          self.store.order.update({ items: data.orders });
        }
      }),
      auth: flow(function* (init = false) {
        self.loading = true;
        if (init) self.store.app.status = 'auth';
        if (!init) yield sleep(300);
        yield self.getToken();
        const result = yield Http.get('/profile/info');
        switch (result.code) {
          case 200: {
            self.set(result.data);
            self.sendPushToken();
            break;
          }
          case 403: {
            yield self.signup();
            break;
          }
          default: {
            self.store.app.setError(
              'Ошибка связи с сервером, попробуйте позже или свяжитесь с поддержкой: 8 800 200 6724'
            );
            break;
          }
        }
        self.loading = false;
      }),
      logout: flow(function* () {
        yield self.removePushToken();
        yield self.store.cart.clear();
        yield AsyncStorage.removeItem('uuid');
        yield AsyncStorage.removeItem('token');
        yield AsyncStorage.removeItem('showLanding');
        yield AsyncStorage.removeItem('firstTime');
        yield AsyncStorage.removeItem('lastShown');
        self.reset();
      }),
      signup: flow(function* () {
        const result = yield Http.post('/profile/signup', { uuid: uuidv4() });
        if (result.code === 200) {
          yield self.set(result.data);
          yield self.sendPushToken();
        } else {
          self.store.app.setError(
            'Не получается создать нового пользователя, попробуйте позже или свяжитесь с поддержкой.'
          );
        }
      }),
      sendPushToken: flow(function* () {
        const pushToken = yield messaging().getToken();
        if (pushToken)
          yield Http.post('/profile/push_token', { token: pushToken, token_type: 'fcm' });
      }),
      removePushToken: flow(function* () {
        const pushToken = yield messaging().getToken();
        if (pushToken) yield Http.post('/profile/push_token/remove', { token: pushToken });
      }),
      setAddressAdditional(type, value) {
        self.addresses[0][type] = value;
      },
      setUserData(key, data) {
        self[key] = data;
      },
    }))
    .views((self) => ({
      get address() {
        if (self.addresses?.length) {
          return self.addresses[0];
        }

        return null;
      },
      get confirmed() {
        return self.phone?.length;
      },
      get userSex() {
        if (!self.sex) return '';
        return self.sex === 'man' ? 'Мужской' : 'Женский';
      },
      get defaultDate() {
        if (!self.birthday_at) return '';
        return dayjs(self.birthday_at, 'YYYY-MM-DD').format('DD.MM.YYYY');
      },
      get hasCompletedOrders() {
        return self.store.order.items.find((el) => el.status === 'done');
      },
      get hasCompletedOrdersNumber() {
        return self.store.order.items.filter((el) => el.status === 'done').length;
      },
    }))
);

export default UserStore;
