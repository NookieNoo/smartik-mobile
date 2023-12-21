import { types } from 'mobx-state-tree';

const SlideBannerItem = types.model({
  background_color: types.string,
  location: types.string,
  model_uuid: types.maybeNull(types.string),
  subtitle: types.maybeNull(types.string),
  text_color: types.maybeNull(types.string),
  title: types.maybeNull(types.string),
  type: types.maybeNull(types.string),
  uuid: types.maybeNull(types.string),
});

export default SlideBannerItem;
