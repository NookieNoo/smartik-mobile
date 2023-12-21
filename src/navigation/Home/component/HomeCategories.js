import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import { useStore } from '../../../store/Context';
import CatalogCard from '../../../component/template/ProductCard/CatalogCard';

const HomeCategories = () => {
  const store = useStore();

  const categories = [
    {
      name: 'Максимальные скидки',
      items: store.homeCategories.discountProducts,
      hasItems: !!store.homeCategories.discountProducts.length,
    },
    {
      name: 'Рекомендации',
      items: store.homeCategories.recommendProducts,
      hasItems: !!store.homeCategories.recommendProducts.length,
    },
    {
      name: 'Осталось 5 дней',
      items: store.homeCategories.fiveDaysProducts,
      hasItems: !!store.homeCategories.fiveDaysProducts.length,
    },
    {
      name: 'Осталось 15 дней',
      items: store.homeCategories.fifteenDaysProducts,
      hasItems: !!store.homeCategories.fifteenDaysProducts.length,
    },
    {
      name: 'С большим сроком',
      items: store.homeCategories.bigDueDateProducts,
      hasItems: !!store.homeCategories.bigDueDateProducts.length,
    },
    {
      name: 'Колбасы, сосиски',
      items: store.homeCategories.sausageProducts,
      hasItems: !!store.homeCategories.sausageProducts.length,
    },
    {
      name: 'Сыры',
      items: store.homeCategories.cheeseProducts,
      hasItems: !!store.homeCategories.cheeseProducts.length,
    },
    {
      name: 'Молочная продукция',
      items: store.homeCategories.milkProducts,
      hasItems: !!store.homeCategories.milkProducts.length,
    },
    {
      name: 'Не продукты',
      items: store.homeCategories.notProducts,
      hasItems: !!store.homeCategories.notProducts.length,
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

export default observer(HomeCategories);

const Wrapper = styled.View`
  margin-bottom: 25px;
`;
const CategoryWrapper = styled.View`
  margin-top: 25px;
`;
const Header = styled.Text`
  font-weight: 700;
  font-size: 17px;
  margin-left: 14px;
  line-height: 21.32px;
`;
const ScrollWrapper = styled.ScrollView`
  margin-top: 10px;
  padding-left: 14px;
`;
const ItemWrapper = styled.View`
  margin-right: 8px;
  width: 130px;
  height: 266px;
`;
const LoaderView = styled.View`
  margin-top: 40px;
`;
