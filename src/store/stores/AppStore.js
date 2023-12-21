import dayjs from 'dayjs';
import semver from 'semver';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { flow, types } from 'mobx-state-tree';
import { observable } from 'mobx';
import * as Updates from 'expo-updates';
import sleep from '../../component/sleep';
import Http from '../../initialize/Http';
import BaseStore from '../BaseStore';
import AppMetrica from 'react-native-appmetrica';
import appsFlyer from 'react-native-appsflyer';
import * as Sentry from 'sentry-expo';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Alert, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { ray } from 'node-ray/web';
import { isEmpty } from 'lodash';

const AppStore = types.compose(
  BaseStore,
  types
    .model({
      landing: false,
      globalLoading: false,
      status: types.optional(
        types.enumeration([
          'init',
          'checkNewVersion',
          'foundNewVersion',
          'reload',
          'auth',
          'idle',
          'offline',
          'version',
          'error',
        ]),
        'init'
      ),
      error: types.maybeNull(types.string),
    })
    .volatile((self) => ({
      pushConfig: observable({
        android: {
          channelId: null,
        },
      }),
      count: observable({
        loading: false,
        uuid: '',
        error: '',
      }),
      deeplink: null,
      deeplinkUpdate: null,
    }))
    .actions((self) => ({
      load: flow(function* () {
        self.status = 'init';
        if (!__DEV__) {
          yield self.checkNewVersion();
        }
        if (!['error', 'offline', 'version'].includes(self.status)) {
          yield self.store.user.auth(true);
          yield self.requestFCM();
          self.status = 'idle';
        }
      }),

      setDeeplink: (url) => {
        self.deeplink = url;
        self.deeplinkUpdate = dayjs().unix();
      },

      reload: flow(function* () {
        self.status = 'reload';
        yield sleep(1000);
        yield Updates.reloadAsync();
      }),

      checkNewVersion: flow(function* () {
        // проверка reference/minimum, есть ли связь и требуется ли обновление из стора
        const reference = yield Http.get('/reference/minimum', { withoutPrefix: true });
        if (!reference.success) {
          self.status = 'offline';
          self.error =
            'Ошибка связи с сервером, попробуйте позже или свяжитесь с поддержкой: 8 800 200 6724';
          return;
        }

        const os = Device.osName.toLowerCase();
        const current = semver.valid(semver.coerce(Application.nativeApplicationVersion));
        //const recommended = semver.valid(semver.coerce(reference.data[os]?.now ?? 1))
        const minimum = semver.valid(semver.coerce(reference.data[os]?.minimum ?? 1));
        const needExpoUpdate = reference.data[os]?.needExpoUpdate ?? true;
        const url = reference.data[os]?.market ?? 'https://pokupkin.market';

        if (semver.lt(current, minimum)) {
          self.status = 'version';

          Alert.alert(
            'Вышло обновление',
            'Мы выпустили новую версию приложения и вы просто обязаны это увидеть!',
            [
              {
                text: 'Обновить',
                onPress: () => {
                  Linking.openURL(url);
                },
              },
            ],
            { cancelable: false }
          );
          return;
        }

        // если проверка на expo-updates не нужна, то сразу выход
        if (!needExpoUpdate) return;

        // иначе проверяем новый js код
        yield self.update();
      }),

      update: flow(function* (direct = false) {
        self.status = 'checkNewVersion';
        const reloadTimer = setTimeout(() => (self.status = 'idle'), 15000);
        const update = yield Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          self.status = 'foundNewVersion';
          yield Updates.fetchUpdateAsync();
          yield self.reload();
        }
        if (direct) {
          self.status = 'idle';
        }
        clearTimeout(reloadTimer);
      }),

      setError(error) {
        self.status = 'error';
        self.error = error;
      },

      setAnalyticEvent(message, AFObject = {}) {
        appsFlyer.logEvent(
          message,
          AFObject,
          (res) => {},
          (error) => {
            Sentry.Native.captureMessage('appsflyer error', { extra: { error } });
          }
        );

        if (!__DEV__) {
          Http.post(`/af_event`,
            {
              type: message,
              ...(!isEmpty(AFObject) && { data: AFObject }),
            }
          );
        }

        AppMetrica.reportEvent(message);
      },

      requestFCM: flow(function* () {
        yield messaging().requestPermission();
        yield notifee.createChannel({
          id: 'default',
          name: 'Сообщения от покупкина',
          lights: false,
          sound: 'default',
          vibration: true,
          importance: AndroidImportance.DEFAULT,
        });
        /*const authStatus = yield messaging().requestPermission()
         const enabled =
         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
         authStatus === messaging.AuthorizationStatus.PROVISIONAL

         if (enabled) {
         const token = yield messaging().getToken()
         console.log('token', token)
         }*/
      }),

      setLanding() {
        self.landing = true;
      },
    }))
    .views((self) => ({
      get statusTitle() {
        switch (self.status) {
          case 'checkNewVersion':
            return 'Проверка обновления';
          case 'foundNewVersion':
            return 'Установка обновления';
          case 'reload':
            return 'Перезагрузка';
          case 'idle':
            return 'Загружено';
          case 'offline':
            return 'Нет сети';
          case 'auth':
            return 'Авторизация';
          case 'error':
            return 'Ошибка';
          case 'version':
            return 'Требуется обновление';
          default:
            return 'Инициализация';
        }
      },
    }))
);

export default AppStore;
