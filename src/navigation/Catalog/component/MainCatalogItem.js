import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import config from '../../../config';
import { ImageBackground, useWindowDimensions } from 'react-native';

const MainCatalogItem = ({ catalog }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  return (
    <ImageBackground
      source={{
        uri: config.imageUrl + '/media/catalog/' + catalog.uuid + `/big?${catalog.media_uuid}`,
      }}
      style={{
        borderRadius: 8,
        marginHorizontal: 5,
        marginVertical: 5,
      }}
    >
      <Button
        onPress={() => {
          navigation.navigate('CatalogViewScreen', { catalog });
        }}
        style={{
          width: width * 0.3,
          aspectRatio: 1,
        }}
      >
        <Label>{catalog.name}</Label>
      </Button>
    </ImageBackground>
  );
};

export default observer(MainCatalogItem);

const Button = styled.TouchableOpacity`
  border-radius: 8px;
`;
const Label = styled.Text`
  text-align: left;
  margin-top: 8px;
  font-size: 13px;
  letter-spacing: -0.4px;
  font-weight: 600;
  left: 7px;
  max-width: 90%;
  color: #353535;
`;
const Image = styled.Image`
  width: 60px;
  height: 60px;
`;
