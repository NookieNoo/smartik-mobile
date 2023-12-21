import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useState } from 'react';
import Swiper from 'react-native-swiper';
import MainCatalogItem from './MainCatalogItem';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../../../store/Context';

const MainCatalogSwiper = () => {
  const store = useStore();

  const data = useMemo(() => {
    const data = [];
    store.catalog.items.map((item, index) => {
      if (index % 8 === 0 || !data.length) data.push([]);
      data[data.length - 1].push(item);
    });

    return data;
  }, [store.catalog.items.length]);

  return (
    <Wrapper>
      {data.length ? (
        <Swiper
          height={270}
          showsButtons={false}
          loop={false}
          showsPagination={true}
          dotColor="#9C9C9C"
          activeDotColor="#2C2C2B"
        >
          {data.map((catalog, index) => (
            <MainCatalogItem key={'rc-' + index} catalog={catalog} />
          ))}
        </Swiper>
      ) : null}
    </Wrapper>
  );
};

export default observer(MainCatalogSwiper);

const Wrapper = styled.View`
  height: 270px;
`;
const CatalogWrapper = styled.View`
  flex: 1;
`;
