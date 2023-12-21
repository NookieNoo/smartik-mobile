import { createContext, useContext } from 'react';

const StoreContext = createContext(null);

export const StoreProvider = ({ store, children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within a StoreProvider');
  return store;
};
