import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import { showMessage } from 'react-native-flash-message';
import { isValidPhoneNumber } from 'libphonenumber-js';
import Http from '../../initialize/Http';
import { useIsFocused } from '@react-navigation/native';
import sleep from '../../component/sleep';
import { useStore } from '../../store/Context';
import CloseIcon from '../../assets/svg/icon/CloseIcon';

const LoginPhoneScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();
  const inputRef = useRef();
  const isFocused = useIsFocused();
  const { next = 'back' } = route.params ?? {};

  const [phone, setPhone] = useState();
  const [prettyPhone, setPrettyPhone] = useState('');
  const [canSend, setCanSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clearButton, setClearButton] = useState(false);

  useEffect(() => {
    store.app.setAnalyticEvent('auth_type_phone');
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [isFocused]);

  useEffect(() => {
    makePrettyPhone();
    setCanSend(phone?.toString()?.length === 10);
  }, [phone]);

  const typePhone = (data) => {
    //if (data.length === 11) return
    if (!data.length) {
      setPhone(null);
    } else if (Number.isInteger(parseInt(data))) {
      setPhone(parseInt(data));
    }
  };

  const makePrettyPhone = () => {
    let result = '';
    if (!phone?.toString()) {
      setPrettyPhone('');
      setClearButton(false);
      return;
    }
    let number = phone.toString();

    if (number.length < 3) {
      result = '(' + phone;
    } else if (number.length === 3) {
      result = '(' + phone + ')';
    } else if (number.length <= 6) {
      result = '(' + number.substr(0, 3) + ') ' + number.substr(3);
    } else if (number.length <= 8) {
      result = '(' + number.substr(0, 3) + ') ' + number.substr(3, 3) + '-' + number.substr(6, 2);
    } else if (number.length <= 10) {
      result =
        '(' +
        number.substr(0, 3) +
        ') ' +
        number.substr(3, 3) +
        '-' +
        number.substr(6, 2) +
        '-' +
        number.substr(8, 2);
    }
    setPrettyPhone(result);
  };

  const sendSMS = async () => {
    if (isValidPhoneNumber(phone.toString(), 'RU')) {
      setClearButton(false);
      setLoading(true);
      await sleep(200);
      let result = await Http.post('/profile/sms/request', { phone: '+7' + phone });
      if (result.code === 200) {
        navigation.navigate('LoginCodeScreen', { phone, next });
      }
      await sleep(500);
      setLoading(false);
    } else {
      setClearButton(true);
      showMessage({
        message: 'Регион вашего номера не поддерживается',
        style: {
          backgroundColor: '#E83329',
          marginBottom: Platform.OS === 'ios' ? -15 : 0,
        },
        icon: 'warning',
        duration: 2500,
        position: 'top',
        statusBarHeight: 40,
      });
    }
  };

  return (
    <Wrapper>
      <Welcome>Введите ваш номер телефона</Welcome>
      <PhoneWrapper onPress={() => inputRef.current.focus()}>
        <PhoneDigit>
          +7{' '}
          {prettyPhone === '' ? <PhonePlaceholder>(000) 000-00-00</PhonePlaceholder> : prettyPhone}
        </PhoneDigit>
        {clearButton && (
          <ClearButton onPress={() => setPhone('')}>
            <ClearButtonIcon>
              <CloseIcon size="6" color="#fff" />
            </ClearButtonIcon>
          </ClearButton>
        )}
      </PhoneWrapper>

      <TextInput
        ref={inputRef}
        autoFocus
        value={phone}
        keyboardType={'number-pad'}
        style={{ width: 1, height: 1, opacity: 0 }}
        onChangeText={typePhone}
        maxLength={10}
      />

      <SendButton disabled={!canSend || loading} onPress={sendSMS}>
        <SendButtonTitle>
          {!loading ? 'Отправить код' : <ActivityIndicator size="small" color="#FFFFFF" />}
        </SendButtonTitle>
      </SendButton>
      <Disclaimer>
        Продолжая авторизацию, вы соглашаетесь с{' '}
        <Text
          onPress={() => Linking.openURL('https://pokupkin.me/oferta')}
          style={{ color: '#8356CE' }}
        >
          Условиями использования сервиса
        </Text>{' '}
        и{' '}
        <Text
          onPress={() => Linking.openURL('https://pokupkin.me/policy')}
          style={{ color: '#8356CE' }}
        >
          Политикой обработки персональных данных.
        </Text>
      </Disclaimer>
    </Wrapper>
  );
};

export default observer(LoginPhoneScreen);

const Wrapper = styled.View`
  flex: 0.5;
  margin-top: 50px;
  padding-horizontal: 18px;
  align-items: center;
`;
const Welcome = styled.Text`
  font-weight: 700;
  font-size: 23px;
`;
const PhoneWrapper = styled.Pressable`
  width: 100%;
  margin-top: 50px;
  padding-bottom: 14px;
  border-bottom-width: 1px;
  border-color: #bdbdbd;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;
const PhoneDigit = styled.Text`
  font-size: 22px;
  padding-left: 5px;
`;
const SendButton = styled(TouchableOpacity)`
  margin-top: 22px;
  width: 90%;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: ${(props) => (props.disabled ? '#7B4EDE30' : '#7B4EDE')};
  border-radius: 14px;
`;
const SendButtonTitle = styled(Text)`
  font-weight: 500;
  color: #ffffff;
  font-size: 17px;
`;
const Disclaimer = styled(Text)`
  flex-direction: row;
  margin-top: 15px;
  font-weight: 400;
  font-size: 13px;
  text-align: center;
`;
const PhonePlaceholder = styled.Text`
  color: #e1e1e1;
  font-weight: 400;
  font-size: 22px;
`;
const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  padding: 8px;
  bottom: 10px;
`;
const ClearButtonIcon = styled.View`
  width: 16px;
  height: 16px;
  background-color: #979797;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;
