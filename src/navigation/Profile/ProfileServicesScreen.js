import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store/Context';
import styled from 'styled-components';
import BackButtonIcon from '../../assets/svg/icon/BackButtonIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowRightButtonIcon from '../../assets/svg/icon/ArrowRightButtonIcon';

const ProfileServicesScreen = () => {
  const navigation = useNavigation();
  const store = useStore();

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <BackButtonIcon />
        </TouchableOpacity>
        <HeaderTitle>О сервисе</HeaderTitle>
        <View style={{ flex: 1 }} />
      </Header>

      <MenuWrapper>
        <MenuItem onPress={() => Linking.openURL(`https://pokupkin.me/oferta`)}>
          <MenuTitle>Оферта</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem onPress={() => Linking.openURL(`https://pokupkin.me/delivery-terms`)}>
          <MenuTitle>Условия и сроки доставки</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem onPress={() => Linking.openURL(`https://pokupkin.me/policy`)}>
          <MenuTitle>Политика конфиденциальности</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem onPress={() => Linking.openURL(`https://pokupkin.me/return`)}>
          <MenuTitle>Правила возврата / обмена товаров</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
      </MenuWrapper>
    </Wrapper>
  );
};

export default observer(ProfileServicesScreen);

const Wrapper = styled(SafeAreaView)`
  flex: 1;
`;
const Header = styled.View`
  flex-direction: row;
  margin-horizontal: 14px;
  justify-content: space-between;
`;
const HeaderTitle = styled.Text`
  font-weight: 500;
  font-size: 14px;
  align-self: center;
  flex: 1;
  text-align: center;
`;
const MenuWrapper = styled.ScrollView`
  margin-top: 15px;
  padding-top: 20px;
  padding-horizontal: 15px;
`;
const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #e3e3e3;
  justify-content: space-between;
`;
const MenuTitle = styled(Text)`
  font-size: 17px;
  font-weight: 400;
  padding-vertical: 12px;
  color: #000000;
`;
