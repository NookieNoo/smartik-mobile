import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store/Context';
import styled from 'styled-components';
import Constants from 'expo-constants';
import WhatsappIcon from '../../assets/svg/icon/WhatsappIcon';
import PhoneIcon from '../../assets/svg/icon/PhoneIcon';
import ShareIconProfile from '../../assets/svg/icon/ShareIconProfile';
import ArrowRightButtonIcon from '../../assets/svg/icon/ArrowRightButtonIcon';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const store = useStore();

  return (
    <Wrapper>
      <View
        style={{ paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Text style={{ fontWeight: '700', fontSize: 20 }}>Профиль</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', {
              screen: 'ProfilePromoShareViewScreen',
              params: { item: 'money' },
            })
          }
        >
          <ShareIconProfile />
        </TouchableOpacity>
      </View>

      <MenuWrapper>
        <MenuItem onPress={() => navigation.navigate('ProfileMyOrdersScreen')}>
          <MenuTitle>Мои заказы</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem
          onPress={() => {
            if (store.user.confirmed) {
              navigation.navigate('ProfileDataScreen');
            } else {
              navigation.navigate('ModalNavigation', {
                screen: 'LoginPhoneScreen',
                params: { next: 'profile' },
              });
            }
          }}
        >
          <MenuTitle>Мои данные</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem onPress={() => navigation.navigate('ProfilePromoScreen')}>
          <MenuTitle>Бонусы и промокоды</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        {/* <MenuItem onPress={() => navigation.navigate('ProfileCardsScreen')}>
          <MenuTitle>Способы оплаты</MenuTitle>
        </MenuItem> */}
        <MenuItem onPress={() => navigation.navigate('ProfileServicesScreen')}>
          <MenuTitle>О сервисе</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
        <MenuItem onPress={() => Linking.openURL(`https://pokupkin.me/delivery-terms`)}>
          <MenuTitle>Условия и сроки доставки</MenuTitle>
          <ArrowRightButtonIcon />
        </MenuItem>
      </MenuWrapper>
      {/* <BottomMenu>
        <BottomMenuItem onPress={() => Linking.openURL(`tel:+78002006724`)}>
          <BottomMenuTitle>Позвонить нам</BottomMenuTitle>
        </BottomMenuItem>
        <BottomMenuItem
          onPress={() => {
            if (store.user.phone?.length) {
              logoutConfirm();
            } else {
              navigation.navigate('ModalNavigation', { screen: 'LoginPhoneScreen' });
            }
          }}
        >
          <BottomMenuTitle>
            {store.user.confirmed ? 'Выйти из аккаунта' : 'Войти по номеру телефона'}
          </BottomMenuTitle>
        </BottomMenuItem>
      </BottomMenu> */}
      <SocialNetworkView>
        <SocialNetworkButton
          style={{ marginRight: 8.5 }}
          onPress={() => Linking.openURL(`https://t.me/+3L0pE-splOhmMjky`)}
        >
          <SocialIcon source={require('../../assets/png/Telegram.png')} />
          <SocialText>Телеграм</SocialText>
        </SocialNetworkButton>
        <SocialNetworkButton
          style={{ marginLeft: 8.5 }}
          onPress={() => Linking.openURL(`https://vk.com/pokupkinme`)}
        >
          <SocialIcon source={require('../../assets/png/VK.png')} />
          <SocialText>ВКонтакте</SocialText>
        </SocialNetworkButton>
      </SocialNetworkView>
      <TelephoneView>
        <CallButton onPress={() => Linking.openURL(`tel:+78002006724`)}>
          <PhoneIcon />
          <CallButtonText>Позвонить нам</CallButtonText>
        </CallButton>
        <WhatsappButton onPress={() => Linking.openURL('whatsapp://send?phone=+79035127680')}>
          <WhatsappIcon />
        </WhatsappButton>
      </TelephoneView>
      <VersionText>
        Версия {Constants.expoConfig.version} сборка {Constants.expoConfig.runtimeVersion}{' '}
      </VersionText>
    </Wrapper>
  );
};

export default observer(ProfileScreen);

const Wrapper = styled(View)`
  flex: 1;
  margin-top: 55px;
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
const VersionText = styled.Text`
  font-size: 8px;
  font-weight: 400;
  color: #979797;
  align-self: center;
  margin-bottom: 4px;
`;
const TelephoneView = styled.View`
  flex-direction: row;
  align-self: center;
  margin-bottom: 35px;
  align-items: center;
`;
const CallButton = styled.TouchableOpacity`
  flex-direction: row;
  padding-horizontal: 32px;
  padding-vertical: 12px;
  border-radius: 8px;
  background-color: #e3e3e3;
  align-items: center;
  justify-content: center;
`;
const CallButtonText = styled.Text`
  margin-left: 15px;
  font-size: 14px;
  font-weight: 500;
`;
const WhatsappButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #e3e3e3;
  margin-left: 15px;
`;
const SocialNetworkView = styled.View`
  flex-direction: row;
  align-self: center;
  margin-bottom: 16px;
`;
const SocialNetworkButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #e3e3e3;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding-horizontal: 11px;
`;
const SocialIcon = styled.Image`
  height: 24px;
  width: 24px;
  resize-mode: contain;
  align-self: center;
`;
const SocialText = styled.Text`
  margin-left: 6px;
`;
