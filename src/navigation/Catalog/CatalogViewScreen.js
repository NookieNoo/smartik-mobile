import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../../store/Context';
import MinimumOrderSum from '../../component/MimimumOrderSum';
import MoveUpIcon from '../../assets/svg/icon/MoveUpIcon';
import TwoColumnsIcon from '../../assets/svg/icon/TwoColumnsIcon';
import ThreeColumnsIcon from '../../assets/svg/icon/ThreeColumnsIcon';
import AllProducts from '../../component/AllProducts';

const CatalogViewScreen = ({ route }) => {
  const store = useStore();
  const navigation = useNavigation();
  const givenCatalog = route.params.catalog;

  const isVisible = useIsFocused();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upButton, setUpButton] = useState(false);

  const listRef = useRef();

  useEffect(() => {
    if (!isVisible) return;
    if (typeof route.params?.catalog?.uuid === 'string' && catalog === null) {
      loadCatalog(route.params.catalog.uuid);
      return;
    }

    navigation.setOptions({
      headerTitle: catalog?.name,
      headerStyle: {
        backgroundColor: '#F7F7F7',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
    store.catalog.setActive(catalog?.uuid);
    store.app.setAnalyticEvent('page_catalog_' + store.catalog?.active?.name);
    setLoading(false);
  }, [isVisible, catalog]);

  const loadCatalog = async (catalog) => {
    setLoading(true);
    await store.catalog.fetch();
    await store.product.getItemsByCatalog(givenCatalog.uuid);

    let find = undefined;
    store.catalog.items.map((rootItem) => {
      if (rootItem.uuid === catalog) {
        find = rootItem;
      } else {
        rootItem.children.map((childrenItem) => {
          if (childrenItem.uuid === catalog) {
            find = childrenItem;
          }
        });
      }
    });
    if (find) {
      setCatalog(find);
    }
    setLoading(false);
  };

  const Tags = () => {
    if (store.catalog.loading || loading) return null;
    return (
      <TagsWrapper>
        {catalog?.children?.map((children, index) => (
          <TagsButton
            key={'t-' + index}
            onPress={() =>
              navigation.getState().routeNames.includes('SearchScreen')
                ? navigation.push('SearchCatalogView', { catalog: children })
                : navigation.push('CatalogViewScreen', { catalog: children })
            }
          >
            <TagsLabel>{children.name}</TagsLabel>
          </TagsButton>
        ))}
      </TagsWrapper>
    );
  };

  const moveToUp = () => {
    setUpButton(false);
    listRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const calculateBottom = () => {
    if (store.cart.products.length === 0) {
      return 10;
    }

    if (
      store.cart.deliveryStatus.possible ||
      (store.cart.delivery_price === 0 && store.cart.sumProducts >= store.cart.delivery.possible)
    ) {
      return 90;
    }

    return 60;
  };

  if (store.product.loading || loading) {
    return (
      <Wrapper>
        <LoaderView>
          <ActivityIndicator size={'large'} />
        </LoaderView>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ScrollView
        ref={listRef}
        onScroll={(e) => {
          if (e.nativeEvent.contentOffset.y < 5) {
            setUpButton(false);
          } else if (e.nativeEvent.contentOffset.y > 300) {
            setUpButton(true);
          }
        }}
        scrollEventThrottle={0}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => store.product.getItemsByCatalog(givenCatalog.uuid)}
          />
        }
      >
        <ContentView>
          <Tags />
          <ChangeLayoutButton onPress={() => store.layout.setColumnNumber()}>
            {store.layout.columnsNumber === '2' ? <TwoColumnsIcon /> : <ThreeColumnsIcon />}
          </ChangeLayoutButton>
        </ContentView>

        <AllProducts showHeader={false} list={store.product.catalogProducts} />
      </ScrollView>
      {upButton && (
        <UpButton onPress={moveToUp} bottom={calculateBottom()}>
          <MoveUpIcon />
        </UpButton>
      )}
      <MinimumOrderSum />
    </Wrapper>
  );
};

export default observer(CatalogViewScreen);

CatalogViewScreen.whyDidYouRender = true;

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  background-color: #f7f7f7;
`;
const ContentView = styled.View`
  flex: 1;
  padding-horizontal: 10px;
`;
const TagsWrapper = styled.View`
  padding-right: 15px;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 7px;
`;
const TagsButton = styled.TouchableOpacity`
  margin: 5px 5px 0 0;
  background-color: #fefefe;
  border-radius: 6px;
  shadow-color: rgba(0, 0, 0, 0.15);
  shadow-offset: 2px;
  shadow-opacity: 0.3;
  shadow-radius: 5px;
`;

const TagsLabel = styled.Text`
  font-weight: 500;
  padding: 8px 16px;
  font-size: 14px;
  color: #353535;
`;
const ItemWrapper = styled.View`
  width: ${Dimensions.get('screen').width * 0.46}px;
  height: 340px;
`;
const UpButton = styled.TouchableOpacity`
  height: 54px;
  width: 54px;
  border-radius: 27px;
  background-color: #8356ce;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: ${(props) => props.bottom}px;
  left: 15px;
  z-index: 10;
`;
const ChangeLayoutButton = styled.TouchableOpacity`
  align-self: flex-end;
  margin-bottom: 9px;
  margin-right: 7px;
  padding: 10px;
`;
const LoaderView = styled.View`
  flex: 1;
  justify-content: center;
`;
