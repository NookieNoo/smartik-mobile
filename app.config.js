module.exports = ({ config }) => {
  const bankSchemas = [];
  for (let i = 1; i < 10000; i++) {
    bankSchemas.push('bank' + (100000000000 + i));
  }

  config.ios = {
    ...config.ios,
    infoPlist: {
      ...config.ios.infoPlist,
      LSApplicationQueriesSchemes: [
        ...config.ios.infoPlist.LSApplicationQueriesSchemes,
        ...bankSchemas,
      ],
    },
  };

  switch (process.env.MYENV) {
    case 'development': {
      return {
        ...config,
        name: 'Покупкин Dev',
        scheme: 'smartik-dev',
        ios: {
          ...config.ios,
          bundleIdentifier: 'com.smartik.dev',
          config: {
            ...config.ios.config,
            googleMapsApiKey: '',
          },
          googleServicesFile: './google-services/ios.development.plist',
        },
        android: {
          ...config.android,
          package: 'com.smartik.dev',
          googleServicesFile: './google-services/android.development.json',
          config: {
            ...config.android.config,
            googleMaps: {
              ...config.android.config.googleMaps,
              apiKey: '',
            },
          },
        },
      };
    }
    case 'prerelease':
    case 'testflight': {
      return {
        ...config,
        name: 'Покупкин Pre',
        scheme: 'smartik-pre',
        ios: {
          ...config.ios,
          bundleIdentifier: 'com.smartbuy.smartik',
          config: {
            ...config.ios.config,
            googleMapsApiKey: '',
          },
          googleServicesFile: './google-services/ios.preview.plist',
        },
        android: {
          ...config.android,
          package: 'com.smartbuy.smartik',
          googleServicesFile: './google-services/android.preview.json',
          config: {
            ...config.android.config,
            googleMaps: {
              ...config.android.config.googleMaps,
              apiKey: '',
            },
          },
        },
      };
    }
    default: {
      return config;
    }
  }
};
