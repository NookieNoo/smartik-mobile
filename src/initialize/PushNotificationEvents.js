import notifee, { EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { ray } from 'node-ray/web';
import { useStore } from '../store/Context';
import parseDeepLink from './DeepLink';

const PushNotificationEvents = ({ children }) => {
  const [message, setMessage] = useState({ type: null, message: null });
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    messaging().onNotificationOpenedApp((message) => {
      if (message) {
        ray('onNotificationOpenedApp', message);
        setMessage({
          type: 'opened',
          message: { action: message.data?.action, data: safetyParse(message.data?.data) },
          original: message,
        });
      }
    });
    messaging()
      .getInitialNotification()
      .then((message) => {
        if (message) {
          ray('getInitialNotification', message);
          setMessage({
            type: 'initial',
            message: { action: message.data?.action, data: safetyParse(message.data?.data) },
            original: message,
          });
        }
      });
    return messaging().onMessage((message) => {
      if (message) {
        ray('onMessage', message);
        notifee.displayNotification({
          title: message.notification.title,
          body: message.notification.body,
          data: message.data,
          android: {
            channelId: 'default',
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          setMessage({
            type: 'inside',
            message: {
              action: detail.notification.data?.action,
              data: safetyParse(detail.notification.data?.data),
            },
            original: detail,
          });
          break;
      }
    });
  }, []);

  useEffect(() => {
    ray('message', message);
    if (message?.type !== null) {
      if (message.message.action) {
        // пришло из админки
        switch (message.message.action) {
          case 'navigation': {
            navigation.navigate(message.message.data.screen, message.message.data.params);
            break;
          }
          case 'update': {
            store.app.update(true);
            break;
          }
          case 'reload': {
            store.app.reload();
            break;
          }
        }
      } else if (message.original.notification?.data?.url) {
        const { screen, params } = parseDeepLink(message.original.notification?.data?.url);
        if (screen) {
          navigation.navigate(screen, params);
        }
      }
    }
  }, [message]);

  const safetyParse = (json) => {
    try {
      return JSON.parse(json);
    } catch (error) {
      return json;
    }
  };

  return children;
};

export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //console.log('remoteMessage', remoteMessage)
  });
};

export default PushNotificationEvents;
