import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

const ProfileFavoritesScreen = () => {
  return (
    <Wrapper>
      <EmptyData>
        <Title>Добавьте избранное</Title>
        <Description>Здесь будут список избранных товаров</Description>
      </EmptyData>
    </Wrapper>
  );
};

export default observer(ProfileFavoritesScreen);

const Wrapper = styled(View)`
  flex: 1;
  padding: 15px;
`;
const EmptyData = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Title = styled(Text)`
  font-weight: 700;
  font-size: 23px;
`;
const Description = styled(Text)`
  margin-top: 7px;
  padding: 0 40px;
  font-size: 17px;
  color: #8e8e93;
  text-align: center;
`;
