import dayjs from 'dayjs';
import AppsFlyer from 'react-native-appsflyer';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import AppMetrica from 'react-native-appmetrica';
import { setBackgroundMessageHandler } from './PushNotificationEvents';
import { Ray } from 'node-ray/web';
import * as Application from 'expo-application';
import { ray } from 'node-ray/web';
import Http from './Http';

const InitSentry = () => {
  const app = Application.applicationId;
  const version = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;
  Sentry.init({
    dsn: 'https://c66abbb3c7ae4f188b3939d0615fb043@o4504084604518400.ingest.sentry.io/4504084606681088',
    tracesSampleRate: 0,
    enableInExpoDevelopment: true,
    debug: __DEV__,
    environment: __DEV__ ? 'development' : 'production',
    attachStacktrace: true,
    release: app + '@' + version,
    dist: buildVersion,
  });
};

const InitRay = () => {
  const app = Application.applicationId;
  const config = {
    enable: false,
    scheme: 'http',
    local_path: null,
    remote_path: null,
    always_send_raw_values: false,
    enabled_callback: null,
    sending_payload_callback: null,
    sent_payload_callback: null,
    not_defined: false,
    port: 23517,
  };

  if (['com.twocomrades.smartik.dev', 'com.twocomrades.smartik.pre'].includes(app)) {
    config.enable = true;
    config.host = '10.9.3.169';
  }

  Ray.useDefaultSettings(config);
  Ray.projectName = 'smartik mobile ' + (__DEV__ ? '[dev]' : '[pro]');
  ray('start app ' + dayjs().format('DD.MM.YYYY HH:mm:ss'));
};

const InitAppsFlyer = () => {
  AppsFlyer.initSdk(
    {
      devKey: 'g72RQ6KrFBxQzCKrEy3ozF',
      isDebug: __DEV__,
      ...(Platform.OS === 'ios' && { appId: '6444164724' }),
      onInstallConversionDataListener: true,
      onDeepLinkListener: false,
      timeToWaitForATTUserAuthorization: 10,
    },
    (result) => {},
    (error) => Sentry.captureMessage('appsflyer error', { extra: { error } })
  );

  AppsFlyer.getAppsFlyerUID((err, appsFlyerUID) => {
    if (err) {
      console.error(err);
    } else {
      console.log('on getAppsFlyerUID: ' + appsFlyerUID);
    }
  });

  if (!__DEV__) {
    AppsFlyer.onInstallConversionData((res) => {
      if (res.data.is_first_launch === true) {
        const result = Http.post(`/af_data_conversion`, { data: res });
      } else {
        const result = Http.post(`/af_data_conversion_temp`, { data: res });
      }
    });
  }
};

const InitMetrica = () => {
  AppMetrica.activate({
    apiKey: 'b45e71f9-1ee3-4c93-8a3a-1172bfa36db5',
    sessionTimeout: 120,
    firstActivationAsUpdate: false,
  });
};

export const InitExternalServices = () => {
  InitRay();
  InitSentry();
  InitAppsFlyer();
  InitMetrica();
  setBackgroundMessageHandler();
};
