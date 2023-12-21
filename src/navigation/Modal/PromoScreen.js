import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef } from 'react';
import { useWindowDimensions, FlatList, View, Platform } from 'react-native';
import styled from 'styled-components';
import AddressZonePromo from '../../component/promo/AddressZonePromo';
import DeliveryPromo from '../../component/promo/DeliveryPromo';
import FreeDeliveryPromo from '../../component/promo/FreeDeliveryPromo';
import ProfitablePromo from '../../component/promo/ProfitablePromo';
import { useStore } from '../../store/Context';
import Story from './component/Story';
import GestureRecognizer from 'react-native-swipe-gestures';
import StoriesScreen from './StoriesScreen';

const PromoScreen = () => {
  const { width } = useWindowDimensions();
  const store = useStore();
  const navigation = useNavigation();

  const flatlistRef = useRef(null);

  const closeStories = () => {
    store.story.setStory(0);
    navigation.goBack();
  };

  const openMap = () => {
    closeStories();
    navigation.navigate('ModalNavigation', { screen: 'AddressLocationScreen' });
  };

  const openCatalog = () => {
    closeStories();
    navigation.navigate('SearchCatalogView', {
      catalog: { children: [], name: 'Успей купить', uuid: 'd38e9f7f-6906-47e6-a40d-870fc7cfbe54' },
    });
  };

  const items = [
    <FreeDeliveryPromo />,
    <StoriesScreen />,
    <ProfitablePromo press={() => openCatalog()} />,
    <DeliveryPromo press={() => closeStories()} />,
    <AddressZonePromo press={() => openMap()} />,
  ];

  const getItemLayout = (data, index) => {
    return {
      length: parseInt(width, 10),
      offset: parseInt(width, 10) * index,
      index,
    };
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 90,
  };
  const onViewableItemsChanged = useCallback((item) => {
    if (item.viewableItems.length === 1) {
      store.story.setStory(item.viewableItems[0].index);
    }
  }, []);
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const goNextStory = () => {
    if (store.story.currentStory === 3) {
      closeStories();
    } else {
      flatlistRef.current.scrollToIndex({ index: store.story.currentStory + 1 });
    }
  };

  const CustomComponent = Platform.OS === 'ios' ? View : GestureRecognizer;

  return (
    <CustomComponent
      style={{
        flex: 1,
        backgroundColor: '#000000',
      }}
      onSwipeDown={() => closeStories()}
    >
      <Wrapper>
        <FlatList
          data={items}
          ref={(ref) => {
            flatlistRef.current = ref;
          }}
          renderItem={({ item, index }) => (
            <PromoView
              style={{
                width: width,
              }}
            >
              {index === 1 ? (
                <Story
                  close={() => navigation.goBack()}
                  index={1}
                  next={goNextStory}
                  referralPromo={true}
                />
              ) : (
                <Story
                  children={item}
                  close={closeStories}
                  index={index}
                  next={goNextStory}
                  promo={true}
                  closeButtonColor={index % 2 === 0 ? '#000' : '#fff'}
                />
              )}
            </PromoView>
          )}
          horizontal
          pagingEnabled={true}
          initialScrollIndex={store.story.currentStory}
          getItemLayout={getItemLayout}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          bounces={false}
          showsHorizontalScrollIndicator={false}
        />
      </Wrapper>
    </CustomComponent>
  );
};

export default observer(PromoScreen);

const Wrapper = styled.View`
  flex: 0.95;
  flex-direction: row;
`;
const PromoView = styled.View``;
