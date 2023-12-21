import { flow, types } from 'mobx-state-tree';

import BaseStore from '../BaseStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LayoutStore = types.compose(
  BaseStore,
  types
    .model('LayoutStore', {
      columnsNumber: '2',
      initialSort: types.maybeNull(types.string),
      modalShown: false,
    })
    .actions((self) => ({
      load: flow(function* () {
        AsyncStorage.getItem('columnsNumber').then((res) => {
          if (res) {
            self.setColumnNumber(res);
          }
        });
      }),
      setColumnNumber() {
        self.columnsNumber = self.columnsNumber === '2' ? '3' : '2';
        AsyncStorage.setItem('columnsNumber', self.columnsNumber);
      },
      setSortType(type) {
        self.initialSort = type;
      },
      setModalShown(type) {
        self.modalShown = type;
      },
    }))
);

export default LayoutStore;
