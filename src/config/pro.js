import * as Localization from 'expo-localization';

export default {
  axios: {
    baseURL: 'https://api.smartik.me',
    headers: {
      'X-Locale': Localization.locale,
    },
    timeout: 5000,
  },
  imageUrl: 'https://api.smartik.me',
};
