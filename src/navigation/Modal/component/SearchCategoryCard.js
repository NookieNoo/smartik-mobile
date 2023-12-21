import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import config from '../../../config';

const SearchCategoryCard = ({ catalog }) => {
  const navigation = useNavigation();
  return (
    <Wrapper>
      <Button onPress={() => navigation.navigate('SearchCatalogView', { catalog: catalog })}>
        <Image
          resizeMode="contain"
          source={{
            uri: config.imageUrl + '/media/catalog/' + catalog.uuid + `/?${catalog.media_uuid}`,
          }}
        />
        <Label numberOfLines={1}>{catalog.name}</Label>
      </Button>
    </Wrapper>
  );
};

export default observer(SearchCategoryCard);

const Wrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
const Button = styled.TouchableOpacity`
  padding: 0 4px;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;
const Label = styled.Text`
  text-align: center;
  margin-top: 5px;
  font-size: 13px;
  margin-left: 15px;
  font-weight: 600;
`;
const Image = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 3px;
`;
