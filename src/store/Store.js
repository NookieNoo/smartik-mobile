import { types } from 'mobx-state-tree';
import AppStore from './stores/AppStore';
import UserStore from './stores/UserStore';
import CatalogStore from './stores/CatalogStore';
import ProductStore from './stores/ProductStore';
import CartStore from './stores/CartStore';
import OrderStore from './stores/OrderStore';
import PaymentCardStore from './stores/PaymentCardStore';
import StoryStore from './stores/StoryStore';
import LayoutStore from './stores/LayoutStore';
import HomeCategoriesStore from './stores/HomeCategoriesStore';

const RootStore = types.model({
  app: AppStore,
  user: UserStore,
  catalog: CatalogStore,
  product: ProductStore,
  cart: CartStore,
  order: OrderStore,
  paymentCards: PaymentCardStore,
  story: StoryStore,
  layout: LayoutStore,
  homeCategories: HomeCategoriesStore,
});

const store = RootStore.create({
  app: {},
  user: {},
  catalog: {},
  product: {},
  cart: { delivery: {} },
  order: {},
  paymentCards: { items: [] },
  story: { currentStory: 0 },
  layout: { columnsNumber: '2', initialSort: '' },
  homeCategories: {},
});

store.app.load();
store.cart.info();
store.layout.load();

export default store;
