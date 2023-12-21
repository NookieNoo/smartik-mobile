import { observer } from 'mobx-react-lite';
import React, { useMemo, useRef, useState } from 'react';
import MainCatalogItem from './MainCatalogItem';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../../../store/Context';
import AllProducts from '../../../component/AllProducts';
import MoveUpIcon from '../../../assets/svg/icon/MoveUpIcon';

const MainCatalogList = () => {
  const store = useStore();

  const listRef = useRef();
  const [triggerMore, setTriggerMore] = useState(false);
  const [upButton, setUpButton] = useState(false);

  const data = useMemo(() => {
    const data = [];
    store.catalog.items.map((item, index) => {
      if (index % 8 === 0 || !data.length) data.push([]);
      data[data.length - 1].push(item);
    });

    return data;
  }, [store.catalog.items.length]);

  const moveToUp = () => {
    setUpButton(false);
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const calculateBottom = () => {
    if (store.cart.products.length === 0) {
      return 70;
    }

    return 70;
  };

  return (
    <Wrapper>
      {data.length ? (
        <FlatList
          ref={(ref) => {
            listRef.current = ref;
          }}
          data={store.catalog.items}
          renderItem={({ item, index }) => <MainCatalogItem key={'rc-' + index} catalog={item} />}
          numColumns={3}
          ListFooterComponent={
            <Divider>
              <AllProducts trigger={triggerMore} setTrigger={() => setTriggerMore(false)} />
            </Divider>
          }
          onEndReached={() => {
            setTriggerMore(!triggerMore);
          }}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y < 5) {
              setUpButton(false);
            } else if (e.nativeEvent.contentOffset.y > 300) {
              setUpButton(true);
            }
          }}
          style={{}}
          contentContainerStyle={{
            paddingBottom: store.cart.products.length !== 0 ? 50 : 50,
          }}
        />
      ) : null}
      {upButton && (
        <UpButton onPress={moveToUp} bottom={calculateBottom()}>
          <MoveUpIcon height="21" width="17" />
        </UpButton>
      )}
    </Wrapper>
  );
};

export default observer(MainCatalogList);

const Wrapper = styled.View``;
const Divider = styled.View`
  margin-top: 35px;
`;
const UpButton = styled.TouchableOpacity`
  height: 44px;
  width: 44px;
  border-radius: 22px;
  background-color: #8356ce;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: ${(props) => props.bottom}px;
  left: 15px;
  z-index: 10;
`;
