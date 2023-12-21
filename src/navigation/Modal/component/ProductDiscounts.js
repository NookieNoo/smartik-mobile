import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import { useStore } from '../../../store/Context';
import CatalogCard from '../../../component/template/ProductCard/CatalogCard';

const ProductDiscounts = () => {
  const store = useStore();

  const categories = [
    {
      name: 'Максимальные скидки',
      items: store.homeCategories.discountProducts,
      hasItems: !!store.homeCategories.discountProducts.length,
    },
  ];

  return (
    <Wrapper>
      {categories.map(
        ({ name, items, hasItems }) =>
          hasItems && (
            <CategoryWrapper key={name}>
              <Header>{name}</Header>
              <ScrollWrapper horizontal={true} showsHorizontalScrollIndicator={false}>
                {items.map((item, index) => (
                  <ItemWrapper key={'item-' + item.uuid} first={index}>
                    <CatalogCard product={item} price={item.prices[0]} />
                  </ItemWrapper>
                ))}
              </ScrollWrapper>
            </CategoryWrapper>
          )
      )}
    </Wrapper>
  );
};

export default observer(ProductDiscounts);

const Wrapper = styled.View`
  margin-top: 32px;
`;
const CategoryWrapper = styled.View``;
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
