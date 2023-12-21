import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View, Modal } from 'react-native';
import { useStore } from '../../store/Context';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import Http from '../../initialize/Http';
import { showMessage } from 'react-native-flash-message';
import BackButtonIcon from '../../assets/svg/icon/BackButtonIcon';
import { formatDate } from '../../config/helper';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileDataScreen = () => {
  const store = useStore();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(store.user.defaultDate);

  const saveProfile = async (key, value) => {
    value = value?.trim();
    if (key === 'birthday_at' && value.length !== 10) {
      showMessage({
        message: 'Неверная дата рождения',
        style: {
          backgroundColor: '#E83329',
          marginBottom: Platform.OS === 'ios' ? -15 : 0,
        },
        icon: 'warning',
        duration: 2500,
        position: 'top',
        statusBarHeight: 40,
      });
      return;
    }
    if (key === 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      showMessage({
        message: 'Неверный Email',
        style: {
          backgroundColor: '#E83329',
          marginBottom: Platform.OS === 'ios' ? -15 : 0,
        },
        icon: 'warning',
        duration: 2500,
        position: 'top',
        statusBarHeight: 40,
      });
      return;
    }
    if (key === 'birthday_at') {
      value = dayjs(value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    }
    const result = await Http.post('/profile/update', { [key]: value });
    if (result.success) store.user.set(result.data);
  };

  const logoutConfirm = async () => {
    Alert.alert('Выйти из аккаунта?', '', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        style: 'destructive',
        text: 'Выйти',
        onPress: async () => {
          await store.user.logout();
          store.app.load();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
          <BackButtonIcon />
        </TouchableOpacity>
        <HeaderTitle>Мои данные</HeaderTitle>
        <View style={{ flex: 1 }} />
      </Header>
      <InfoWrapper>
        <FormWrapper>
          <FormTitle>Имя</FormTitle>
          <FormInput
            defaultValue={store.user.name}
            onEndEditing={(e) => saveProfile('name', e.nativeEvent.text)}
          />
        </FormWrapper>

        <FormWrapper>
          <FormTitle>Телефон</FormTitle>
          <PhoneButton
            onPress={() => navigation.navigate('ModalNavigation', { screen: 'LoginPhoneScreen' })}
          >
            <PhoneButtonText>{store.user.phone}</PhoneButtonText>
          </PhoneButton>
        </FormWrapper>

        <FormWrapper>
          <FormTitle>Email</FormTitle>
          <FormInput
            keyboardType={'email-address'}
            defaultValue={store.user.email}
            onEndEditing={(e) => saveProfile('email', e.nativeEvent.text)}
          />
        </FormWrapper>
        <FormWrapper>
          <FormTitle>День рождения</FormTitle>
          <FormInput
            keyboardType={'numeric'}
            defaultValue={date}
            onChangeText={(text) => setDate(formatDate(text))}
            onEndEditing={(e) => saveProfile('birthday_at', e.nativeEvent.text)}
            maxLength={10}
          />
        </FormWrapper>
        <FormWrapper>
          <FormTitle>Пол</FormTitle>
          <SexFormInput onPress={() => setModalVisible(true)}>{store.user.userSex}</SexFormInput>
        </FormWrapper>
        <Description>На электронную почту мы будем отправлять Вам чеки после покупок</Description>
      </InfoWrapper>

      <ExitButton
        onPress={() => {
          if (store.user.phone?.length) {
            logoutConfirm();
          } else {
            navigation.navigate('ModalNavigation', { screen: 'LoginPhoneScreen' });
          }
        }}
      >
        <ExitButtonText>Выйти</ExitButtonText>
      </ExitButton>

      <BottomMenuItem
        onPress={async () => {
          Alert.alert(
            'Вы уверены?',
            'Удаление профиля безвозвратно. История заказов, избранное всё будет потеряно 😟',
            [
              {
                text: 'Отмена',
                style: 'cancel',
              },
              {
                style: 'destructive',
                text: 'Уверен',
                onPress: async () => {
                  await store.user.logout();
                  store.app.load();
                },
              },
            ]
          );
        }}
      >
        <BottomMenuTitle red={true}>Удалить профиль</BottomMenuTitle>
      </BottomMenuItem>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <ModalView onPress={() => setModalVisible(false)}>
          <View style={{ top: '40%' }}>
            <SexButton
              onPress={() => {
                saveProfile('sex', 'man');
                setModalVisible(false);
              }}
            >
              <SexLabel>Мужской</SexLabel>
            </SexButton>
            <SexButton
              onPress={() => {
                saveProfile('sex', 'woman');
                setModalVisible(false);
              }}
            >
              <SexLabel>Женский</SexLabel>
            </SexButton>
          </View>
        </ModalView>
      </Modal>
    </SafeAreaView>
  );
};

export default observer(ProfileDataScreen);

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e3e3e3;
  padding-vertical: 14px;
  padding-horizontal: 15px;
`;
const HeaderTitle = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  flex: 1;
  text-align: center;
`;
const FormWrapper = styled(View)`
  margin-top: 15px;
  padding-bottom: 3px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  height: 45px;
`;
const FormTitle = styled(Text)`
  color: #979797;
  font-size: 12px;
  font-weight: 400;
`;
const FormInput = styled(TextInput)`
  padding-vertical: 6px;
  font-size: 15px;
  font-weight: 400;
`;
const Description = styled(Text)`
  margin-top: 20px;
  color: #8e8e93;
  margin-bottom: 40px;
`;
const BottomMenuItem = styled(TouchableOpacity)`
  align-self: center;
  margin-top: 12px;
  border-width: 1px;
  border-color: #8356ce;
  border-radius: 8px;
  background-color: rgba(131, 86, 206, 0.1);
  padding-vertical: 12px;
  padding-horizontal: 10px;
`;
const BottomMenuTitle = styled(Text)`
  font-size: 14px;
  color: #8356ce;
  font-weight: 500;
`;

const PhoneButton = styled(TouchableOpacity)`
  padding-vertical: 6px;
`;
const PhoneButtonText = styled(Text)`
  paddingvertical: 6px;
  font-size: 15px;
  font-weight: 400;
`;
const InfoWrapper = styled.View`
  padding-horizontal: 15px;
`;
const ExitButton = styled.TouchableOpacity`
  border-radius: 8px;
  background-color: #e3e3e3;
  align-self: center;
  margin-top: 50px;
  padding-vertical: 12px;
  padding-horizontal: 50px;
`;
const ExitButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  line-height: 16.71px;
`;
const SexButton = styled.TouchableOpacity`
  height: 40px;
  width: 120px;
  background-color: #ffffff;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: 8px;
  margin-vertical: 5px;
`;
const SexLabel = styled.Text`
  font-size: 18px;
  color: #000000;
  font-weight: 500;
`;
const SexFormInput = styled.Text`
  padding-vertical: 6px;
  font-size: 15px;
  font-weight: 400;
`;
const ModalView = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;
