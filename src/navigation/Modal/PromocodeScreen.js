import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../../store/Context';
import PresentIcon from '../../assets/svg/icon/PresentIcon';

const PromocodeScreen = ({}) => {
  const [code, setCode] = useState('');
  const store = useStore();
  const navigation = useNavigation();

  return (
    <Wrapper>
      <InputWrapper error={store.cart.promo.error}>
        <PresentIcon />
        <Input
          onBlur={() => store.cart.setPromoError(null)}
          autoFocus
          value={code}
          onChangeText={(code) => setCode(code)}
        />
      </InputWrapper>
      {store.cart.promo.error ? <ErrorText>{store.cart.promoError}</ErrorText> : null}
      <Button
        disabled={!code}
        onPress={async () => {
          const result = await store.cart.setPromo(code);
          if (result) {
            navigation.goBack(null);
          }
        }}
      >
        {store.cart.promo.loading ? <ActivityIndicator /> : <Text>Применить промокод</Text>}
      </Button>
    </Wrapper>
  );
};

export default observer(PromocodeScreen);

const Wrapper = styled.View``;
const InputWrapper = styled.View`
  margin: 0 15px 15px;
  padding: 16px;
  border-radius: 14px;
  background-color: #f6f6f6;
  flex-direction: row;
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => (props.error ? 'red' : '#ccc')};
`;
const Input = styled.TextInput`
  font-size: 17px;
  margin-left: 10px;
`;
const Button = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 14px;
  background-color: #333;
  align-items: center;
  margin: 0 15px;
`;
const Text = styled.Text`
  color: #fff;
  font-size: 17px;
`;
const ErrorText = styled.Text`
  color: red;
  font-size: 15px;
  margin: -15px 25px 20px;
`;
