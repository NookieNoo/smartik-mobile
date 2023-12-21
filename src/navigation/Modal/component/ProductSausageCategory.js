import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Dimensions, FlatList, Image, View } from 'react-native';
import Http from '../../../initialize/Http';
import BigCatalogCard from '../../../component/template/ProductCard/BigCatalogCard';
import SmallCatalogCard from '../../../component/template/ProductCard/SmallCatalogCard';

const ProductSausageCategory = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const result = await Http.get('/catalog/f06c3d35-5273-42f1-a594-4fa4b0e78eb6/products');
    if (result.success) {
      if (9 >= result.data.items) {
        // If the count is greater than or equal to the array length, return a copy of the array.
        return [...result.data.items];
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

  const renderItem = (item) => {
    return (
      <ItemWrapper>
        <SmallCatalogCard product={item} price={item.prices[0]} />
      </ItemWrapper>
    );
  };

  return (
    <Wrapper>
      <Header>Колбасы, сосиски</Header>
      <FlatList
        data={data}
        renderItem={({ item }) => renderItem(item)}
        numColumns={3}
        estimatedItemSize={210}
        ItemSeparatorComponent={() => <View style={{ paddingBottom: 10 }} />}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 90,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-evenly',
        }}
      />
    </Wrapper>
  );
};

export default observer(ProductSausageCategory);

const Wrapper = styled.View`
  margin-top: 30px;
`;
const Header = styled.Text`
  font-weight: 700;
  font-size: 17px;
  margin-left: 14px;
  line-height: 21.32px;
  letter-spacing: -0.4px;
  color: #353535;
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
