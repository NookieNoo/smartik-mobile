import { observer } from 'mobx-react-lite';
import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Dimensions, FlatList, Image, View } from 'react-native';
import Http from '../../../initialize/Http';
import SmallCatalogCard from '../../../component/template/ProductCard/SmallCatalogCard';
import MoveUpIcon from '../../../assets/svg/icon/MoveUpIcon';

const ProductMilkCategory = ({ footerComp, headerComp }) => {
  const [data, setData] = useState([]);
  const [upButton, setUpButton] = useState(false);
  const listRef = useRef();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const result = await Http.get('/catalog/d4a1cb84-5487-432a-96e7-51dbd5c9f574/products');
    if (result.success) {
      if (9 >= result.data.items) {
        setData(result.data.items);
      } else {
        const randomIndices = [];
        while (randomIndices.length < 9) {
          const randomIndex = Math.floor(Math.random() * result.data.items.length);
          if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
          }
        }

        setData(randomIndices.map((index) => result.data.items[index]));
      }
    }
  };

  const moveToUp = () => {
    setUpButton(false);
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderItem = (item) => {
    return (
      <ItemWrapper>
        <SmallCatalogCard product={item} price={item.prices[0]} />
      </ItemWrapper>
    );
  };

  return (
    <Wrapper>
      <FlatList
        ref={(ref) => {
          listRef.current = ref;
        }}
        data={data}
        renderItem={({ item }) => renderItem(item)}
        numColumns={3}
        estimatedItemSize={210}
        ItemSeparatorComponent={() => <View style={{ paddingBottom: 10 }} />}
        contentContainerStyle={{
          paddingBottom: 170,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
        }}
        ListHeaderComponent={
          <>
            {headerComp}
            <Header>Молочная продукция</Header>
          </>
        }
        ListFooterComponent={footerComp}
        onEndReachedThreshold={2}
        onEndReached={() => setUpButton(true)}
        onScroll={(e) => {
          if (e.nativeEvent.contentOffset.y < 5) {
            setUpButton(false);
          }
        }}
        showsVerticalScrollIndicator={false}
      />
      {upButton && (
        <UpButton onPress={moveToUp}>
          <MoveUpIcon />
        </UpButton>
      )}
    </Wrapper>
  );
};

export default observer(ProductMilkCategory);

const Wrapper = styled.View``;
const Header = styled.Text`
  font-weight: 700;
  font-size: 17px;
  margin-left: 14px;
  line-height: 21.32px;
  letter-spacing: -0.4px;
  color: #353535;
  margin-top: 30px;
  margin-bottom: 15px;
`;
const ScrollWrapper = styled.ScrollView`
  margin-top: 14px;
  padding-left: 14px;
`;
const Loading = styled(ActivityIndicator)``;
const LoadingWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100px;
  width: ${(props) => props.theme.width ?? 0}px;
`;
const ItemWrapper = styled.View`
  width: ${Dimensions.get('screen').width * 0.31}px;
  height: 266px;
`;
const UpButton = styled.TouchableOpacity`
  height: 54px;
  width: 54px;
  border-radius: 27px;
  background-color: #8356ce;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 120px;
  left: 15px;
`;
