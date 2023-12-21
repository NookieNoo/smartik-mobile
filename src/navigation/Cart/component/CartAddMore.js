import { observer } from 'mobx-react-lite';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';
import ProductCard from '../../../component/template/ProductCard';

const CartAddMore = ({ popular = [] }) => {
  if (!popular.length) return null;

  return (
    <Wrapper>
      <Text style={{ fontSize: 21, fontWeight: '700', paddingHorizontal: 15 }}>Вы покупали</Text>
      <ProductsWrapper>
        {popular.map((product, index) => (
          <ProductCard
            key={'product-' + product.uuid}
            horizontal
            last={index === popular.length - 1}
          />
        ))}
      </ProductsWrapper>
    </Wrapper>
  );
};

export default observer(CartAddMore);

const Wrapper = styled.View`
  margin-top: 40px;
`;
const ProductsWrapper = styled.View``;
