import * as Linking from 'expo-linking';

const parseDeepLink = (url) => {
  url = Linking.parse(url);
  let screen = null;
  let params = null;

  switch (url?.hostname) {
    case 'brand': {
      screen = 'TabNavigation';
      params = { screen: 'Home', params: { screen: 'BrandScreen', params: { brand: url.path } } };
      break;
    }
    case 'catalog': {
      screen = 'TabNavigation';
      params = {
        screen: 'Catalog',
        params: { screen: 'CatalogScreen', params: { catalog: { uuid: url.path } } },
      };
      break;
    }
    case 'product': {
      screen = 'ModalNavigation';
      params = { screen: 'ProductScreen', params: { uuid: url.path } };
      break;
    }
    case 'cart': {
      screen = 'TabNavigation';
      params = { screen: 'Cart', params: { screen: 'CartScreen' } };
      break;
    }
    case 'order': {
      screen = 'ModalNavigation';
      params = { screen: 'OrderScreen', params: { order: { uuid: url.path } } };
      break;
    }
  }

  return { screen, params };
};
export default parseDeepLink;
