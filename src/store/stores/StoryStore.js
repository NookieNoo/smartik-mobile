import { flow, types } from 'mobx-state-tree';

import BaseStore from '../BaseStore';

const StoryStore = types.compose(
  BaseStore,
  types
    .model('StoryStore', {
      currentStory: 0,
      scrollStory: false,
    })
    .actions((self) => ({
      setStory(item) {
        self.currentStory = item;
      },
      setScroll(item) {
        self.scrollStory = item;
      },
      setIncrStory() {
        self.currentStory = self.currentStory + 1;
      },
    }))
);

export default StoryStore;
