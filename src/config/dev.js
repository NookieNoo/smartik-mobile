import * as Localization from 'expo-localization';

export default {
  axios: {
    baseURL: 'https://dev.api.smartik.me',
    //baseURL: "https://api.smartik.me",
    headers: {
      'X-Locale': Localization.locale,
    },
    timeout: 5000,
  },
  imageUrl: 'https://trin.api.smartik.me',
  //imageUrl: "https://api.smartik.me",
};
