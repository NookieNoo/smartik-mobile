import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { showMessage } from 'react-native-flash-message';
import Http from '../../initialize/Http';
import sleep from '../../component/sleep';
import { useStore } from '../../store/Context';

const LoginPhoneScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();

  const [code, setCode] = useState();
  const [prettyCode, setPrettyCode] = useState('');
  const [canSend, setCanSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const { next = 'back', phone } = route.params;

  useEffect(() => {
    store.app.setAnalyticEvent('auth_type_sms_code');
  }, []);

  useEffect(() => {
    makePrettyCode();
    setCanSend(code?.toString()?.length === 4);
    if (code?.toString()?.length === 4) ActivateSMS();
  }, [code]);

  const typeCode = (data) => {
    if (!data.length) {
      setCode(null);
    } else if (Number.isInteger(parseInt(data))) {
      setCode(parseInt(data));
    }
  };

  const makePrettyCode = () => {
    if (!code?.toString()) {
      setPrettyCode('––––');
      return;
    }
    let smsCode = code.toString();
    let result = smsCode;

    for (let i = 0; i < 4 - smsCode.length; i++) {
      result = result + '–';
    }

    setPrettyCode(result);
  };

  const ActivateSMS = async () => {
    setLoading(true);
    await sleep(200);
    let result = await Http.post('/profile/sms/activate', { phone: '+7' + phone, code });
    if (result.code === 200) {
      store.user.set(result.data, true);
      switch (next) {
        case 'back': {
          navigation.popToTop();
          navigation.goBack(null);
          break;
        }
        case 'profile': {
          navigation.popToTop();
          await navigation.goBack(null);
          await navigation.navigate('ProfileDataScreen');
          break;
        }
        default: {
          navigation.popToTop();
          navigation.replace(next);
        }
      }
    } else {
      showMessage({
        message: 'Не верный СМС код',
        style: {
          backgroundColor: '#E83329',
          marginBottom: Platform.OS === 'ios' ? -15 : 0,
        },
        icon: 'warning',
        duration: 2500,
        position: 'top',
        statusBarHeight: 40,
      });

      setCode('');
    }
    setLoading(false);
  };

  return (
    <Wrapper>
      <Welcome>Введите код из СМС</Welcome>
      <CodeWrapper>
        <CodeDigit>{prettyCode}</CodeDigit>
      </CodeWrapper>

      <TextInput
        autoFocus
        value={code}
        keyboardType={'number-pad'}
        style={{ width: 1, height: 1, opacity: 0 }}
        onChangeText={typeCode}
        maxLength={4}
      />

      <SendButton disabled={!canSend || loading} onPress={ActivateSMS}>
        <SendButtonTitle>
          {!loading ? 'Продолжить' : <ActivityIndicator size="small" color="#FFFFFF" />}
        </SendButtonTitle>
      </SendButton>
    </Wrapper>
  );
};

export default observer(LoginPhoneScreen);

const Wrapper = styled.View`
  flex: 1;
  margin-top: 50px;
  padding-horizontal: 18px;
  align-items: center;
`;
const Welcome = styled.Text`
  font-weight: 700;
  font-size: 23px;
`;
const CodeWrapper = styled.View`
  width: 100%;
  margin-top: 50px;
  padding-bottom: 14px;
  border-bottom-width: 1px;
  border-color: #bdbdbd;
  align-items: center;
  justify-content: center;
`;
const CodeDigit = styled.Text`
  font-size: 30px;
  height: 35px;
  padding-left: 5px;
  letter-spacing: 10px;
  font-weight: 700;
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
