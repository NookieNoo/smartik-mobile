import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
import config from '../config';
import { ray } from 'node-ray/web';

const Http = axios.create({});

Http.interceptors.request.use(
  async function (options) {
    ray('http', options);
    if (options.external) return options;

    const prefix = 'user';
    const token = await AsyncStorage.getItem('token');

    if (token && !options.noAuth) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    if (options.withoutPrefix) {
      options.url = config.axios.baseURL + options.url;
    } else {
      options.url = config.axios.baseURL + '/' + prefix + options.url;
    }
    options.headers = { ...options.headers, ...config.axios.headers };

    if (options.method === 'get' && options.params) {
      options.url =
        options.url +
        '?' +
        qs.stringify(options.params, { encodeValuesOnly: true, skipNulls: true });
      options.params = [];
    }

    return options;
  },
  function (error) {
    //console.log("Request error: ", error)
  }
);

Http.interceptors.response.use(
  (response) => {
    return { code: response.status, ...response.data };
  },
  (error) => {
    const json = error.toJSON();

    if (error.response?.data) {
      return {
        code: json.status,
        ...error.response.data,
      };
    }

    return {
      success: false,
      code: json.status,
      error: json.message,
    };
  }
);

export default Http;
