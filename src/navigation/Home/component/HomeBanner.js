import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import HomeBannerComponent from '../../../component/homeBanner/HomeBannerComponent';
import { useStore } from '../../../store/Context';

const HomeBanner = () => {
  const store = useStore();

  useEffect(() => {
    store.homeCategories.fetchSlideBanners();
  }, []);

  if (store.homeCategories.slideBanners.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Swiper
        height={150}
        showsButtons={false}
        loop={true}
        showsPagination={true}
        autoplay={true}
        autoplayTimeout={10}
        dotColor="rgba(255, 255, 255, 0.8)"
        activeDotColor="#353535"
        paginationStyle={{
          bottom: 15,
          position: 'absolute',
        }}
        dotStyle={{
          height: 5,
          width: 5,
        }}
        activeDotStyle={{
          height: 5,
          width: 5,
        }}
      >
        {store.homeCategories.slideBanners.map((item, index) => (
          <ItemWrapper key={index}>
            <HomeBannerComponent item={item} />
          </ItemWrapper>
        ))}
      </Swiper>
    </Wrapper>
  );
};

export default observer(HomeBanner);

const Wrapper = styled.View``;
const ItemWrapper = styled.View`
  width: ${Dimensions.get('screen').width}px;
  height: 150px;
  justify-content: center;
`;
