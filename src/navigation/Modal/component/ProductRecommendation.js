import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import CatalogCard from '../../../component/template/ProductCard/CatalogCard';
import { useStore } from '../../../store/Context';

const ProductRecommendation = () => {
  const store = useStore();
  const list = store.homeCategories.recommendProducts;

  return (
    <Wrapper>
      <Header>С этим товаром покупают</Header>
      <ScrollWrapper horizontal={true} showsHorizontalScrollIndicator={false}>
        {list === 'loading' ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : null}
        {Array.isArray(list)
          ? list.map((item, index) => (
              <ItemWrapper key={'item-' + item.uuid} first={index}>
                <CatalogCard product={item} price={item.prices[0]} />
              </ItemWrapper>
            ))
          : null}
      </ScrollWrapper>
    </Wrapper>
  );
};

export default observer(ProductRecommendation);

const Wrapper = styled.View`
  margin-top: 28px;
`;
const Header = styled.Text`
  font-weight: 700;
  font-size: 17px;
  margin-left: 14px;
  line-height: 21.32px;
  letter-spacing: -0.4px;
  color: #353535;
`;
const ScrollWrapper = styled.ScrollView`
  margin-top: 14px;
  padding-left: 14px;
`;
const ItemWrapper = styled.View`
  margin-right: 8px;
  width: 130px;
  height: 266px;
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
