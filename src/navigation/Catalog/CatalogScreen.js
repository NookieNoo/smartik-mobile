import { useNavigation, useRoute } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useStore } from '../../store/Context';
import MinimumOrderSum from '../../component/MimimumOrderSum';
import AddressSearchView from '../../component/template/AddressSearchView';
import MainCatalogList from './component/MainCatalogList';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styled from 'styled-components';

const CatalogScreen = () => {
  const navigation = useNavigation();
  const store = useStore();
  const route = useRoute();

  useEffect(() => {
    store.app.setAnalyticEvent('page_catalog_main');
    navigation.setOptions({ headerShown: false });
    loadCategories();
  }, []);

  const loadCategories = () => {
    store.catalog.fetch().then(() => {
      if (route?.params?.catalog?.uuid) {
        const find = store.catalog.items.find((item) => item.uuid === route.params.catalog.uuid);
        if (find) {
          navigation.navigate('CatalogViewScreen', { catalog: find });
        }
      }
    });
  };

  return (
    <>
      <Wrapper>
        <AddressSearchView />
        <MainCatalogList />
      </Wrapper>
      <MinimumOrderSum />
      {store.layout.modalShown && (
        <Animated.View
          style={{
            height: Dimensions.get('screen').height,
            width: Dimensions.get('screen').width,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
          }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        />
      )}
    </>
  );
};

export default observer(CatalogScreen);

const Wrapper = styled.SafeAreaView`
  flex: 1;
  padding-top: 50px;
  background-color: #f7f7f7;
`;
