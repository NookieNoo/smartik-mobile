import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator, Image } from 'react-native';
import Http from '../../../initialize/Http';
import config from '../../../config';

const HomeBrand = () => {
  const [data, setData] = useState('loading');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setData('loading');
    const result = await Http.get('/brand');
    setData(result.data);
  };

  const navigation = useNavigation();
  return (
    <Wrapper>
      <Header>Бренды</Header>
      <ScrollWrapper horizontal={true} showsHorizontalScrollIndicator={false}>
        {data === 'loading' ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : null}
        {Array.isArray(data)
          ? data.map((item, index) => (
              <ItemWrapper
                key={index}
                first={index}
                /*onPress={() => navigation.navigate('BrandScreen', {brand: item.slug})}*/
              >
                <ItemLogo bgColor={item.background}>
                  <Image
                    source={{ uri: config.imageUrl + '/media/brand/' + item.slug }}
                    style={{ width: 60, height: 60 }}
                  />
                </ItemLogo>
                <ItemTitle numberOfLines={1}>{item.name}</ItemTitle>
              </ItemWrapper>
            ))
          : null}
      </ScrollWrapper>
    </Wrapper>
  );
};

export default observer(HomeBrand);

const Wrapper = styled.View`
  margin-top: 20px;
`;
const Header = styled.Text`
  //padding-left: 15px;
  font-weight: 600;
  font-size: 18px;
`;
const ScrollWrapper = styled.ScrollView`
  margin-top: 15px;
  max-height: 100px;
`;
const ItemWrapper = styled.View`
  margin-left: ${(props) => (!props.first ? 15 : 0)}px;
  margin-right: 10px;
  max-width: 70px;
  align-items: center;
  height: 96px;
`;
const ItemLogo = styled.View`
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bgColor};
`;
const ItemTitle = styled.Text`
  margin-top: 5px;
  font-size: 10px;
`;
const LoadingWrapper = styled.View`
  flex: 1;
  height: 96px;
  width: ${(props) => props.theme.width ?? 0}px;
  align-items: center;
  justify-content: center;
`;
const Loading = styled(ActivityIndicator)``;
