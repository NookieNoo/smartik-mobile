import { applySnapshot, getRoot, getSnapshot, types } from 'mobx-state-tree';

const BaseStore = types
  .model('BaseStore')
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate() {
        initialState = getSnapshot(self);
      },
      reset() {
        applySnapshot(self, initialState);
      },
      update(data) {
        if (!!data) {
          Object.keys(data).forEach((key) => {
            if (self.hasOwnProperty(key)) self[key] = data[key];
          });
        }
      },
    };
  })
  .views((self) => ({
    get store() {
      return getRoot(self);
    },
  }));

export default BaseStore;
