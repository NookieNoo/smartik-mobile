import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import styled from 'styled-components/native';
import LeftArrowIcon from '../../assets/svg/icon/homeBanner/LeftArrowIcon';
import RightArrowIcon from '../../assets/svg/icon/homeBanner/RightArrowIcon';
import config from '../../config';

const HomeBannerComponent = ({ item }) => {
  const navigation = useNavigation();

  const openCategory = () => {
    if (item.type === 'catalog') {
      navigation.navigate('SearchCatalogView', {
        catalog: {
          uuid: item.model_uuid,
        },
      });
    } else {
      navigation.navigate('ProductScreen', { uuid: item.model_uuid });
    }
  };

  return (
    <Wrapper onPress={openCategory} color={item.backgroundColor}>
      <ImageBackground
        source={{ uri: config.imageUrl + '/media/banner/' + item.uuid + '/big?x' }}
        style={{
          justifyContent: 'center',
        }}
        imageStyle={{
          borderRadius: 14,
        }}
      >
        <ContentView>
          <TextView>
            <Title color={item.text_color}>{item.title}</Title>
            {!!item.subtitle && <Substitle color={item.text_color}>{item.subtitle}</Substitle>}
          </TextView>
        </ContentView>

        <SideArrowsView>
          <LeftArrowIcon />
          <RightArrowIcon />
        </SideArrowsView>
      </ImageBackground>
    </Wrapper>
  );
};

export default observer(HomeBannerComponent);

const Wrapper = styled.TouchableOpacity`
  height: 140px;
  margin-horizontal: 14px;
  border-radius: 14px;
  justify-content: center;
`;
const ContentView = styled.View`
  flex-direction: row;
  height: 100%;
`;
const TextView = styled.View`
  margin-left: 24px;
  margin-vertical: 20px;
  width: 209px;
  justify-content: center;
`;
const Title = styled.Text`
  font-size: 17px;
  font-weight: 700;
  color: ${(props) => props.color};
  max-width: 80%;
`;
const Substitle = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.color};
  margin-top: 5px;
  max-width: 85%;
`;
const CompImage = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: contain;
  right: 0px;
  border-bottom-right-radius: 14px;
  border-top-right-radius: 14px;
`;
const SideArrowsView = styled.View`
  height: 16px;
  width: 100%;
  position: absolute;
  align-self: center;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 4px;
`;
