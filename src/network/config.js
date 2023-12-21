import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { encode } from 'js-base64';

import config from '../config';
//import store from "../store"

const API = axios.create(config.axios);

API.requestApi = async (
  method,
  url,
  options = { data: {}, headers: {}, noAuth: false, external: false }
) => {
  const token = await AsyncStorage.getItem('token');
  const storage = await AsyncStorage.getItem('appHeader');
  const expires = (await AsyncStorage.getItem('appHeaderExpires')) + '';

  const tmp = encode(
    JSON.stringify({
      brand: Device.brand,
      manufacturer: Device.manufacturer,
      modelName: Device.modelName,
      osName: Device.osName,
      osVersion: Device.osVersion,
      deviceName: Device.deviceName,
      appVersion: Constants.manifest.version,
    })
  );

  let headers = { ...config.axios.headers, ...options.headers };

  if (storage !== tmp || dayjs(expires) < dayjs()) {
    await AsyncStorage.setItem('appHeader', tmp);
    await AsyncStorage.setItem('appHeaderExpires', dayjs().add(1, 'days') + '');
    headers['X-App'] = tmp;
  }

  if (token && !options.noAuth) {
    headers['Authorization'] = 'Bearer ' + token;
  }

  // ставим сокет
  /*if (store.socket.id) {
		headers["X-Socket-ID"] = store.socket.id
	}*/

  if (!options.external) {
    url = '/driver' + url;
  }

  let result;
  try {
    switch (method) {
      case 'post':
      case 'put':
      case 'path': {
        result = await API[method](url, options.data, { headers });
        break;
      }
      case 'delete': {
        result = await API.delete(url, { headers, data: options.data });
        break;
      }
      default: {
        result = await API[method](url, { headers, params: options.data && options.data });
      }
    }
  } catch (error) {
    if (error.response) {
      result = error.response;
    } else if (error.request) {
      result = {
        status: 500,
        data: 'network error',
        error: error.request,
      };
    } else {
      result = {
        status: 500,
        data: 'axios error',
        error: error.message,
      };
    }
  }

  return result;
};

export default API;
