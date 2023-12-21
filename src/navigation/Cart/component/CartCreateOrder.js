import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import { useStore } from '../../../store/Context';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoLogo from '../../../assets/svg/icon/InfoLogo';
import CarIcon from '../../../assets/svg/icon/CarIcon';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

const CartCreateOrder = ({ comment, setComment, error, timeDeliveryAt, setTimeDeliveryAt }) => {
  const navigation = useNavigation();
  const store = useStore();

  const radioInputsArr = [
    {
      label: `${dayjs(store.cart.delivery_at).format('DD MMMM')}, с ${
        store.cart.delivery_time[0][0]
      }:00 до ${store.cart.delivery_time[1][1]}:00`,
      value: 2,
    },
    {
      label: `${dayjs(store.cart.delivery_at).format('DD MMMM')}, с ${
        store.cart.delivery_time[0][0]
      }:00 до ${store.cart.delivery_time[0][1]}:00`,
      value: 0,
    },
    {
      label: `${dayjs(store.cart.delivery_at).format('DD MMMM')}, с ${
        store.cart.delivery_time[1][0]
      }:00 до ${store.cart.delivery_time[1][1]}:00`,
      value: 1,
    },

  ];

  useEffect(() => {
    (async () => {
      const asyncComment = await AsyncStorage.getItem('orderComment');
      if (asyncComment?.length) setComment(asyncComment);
    })();
  }, []);

  return (
    <Wrapper>
      <OrderWrapper>
        <OrderOptionWrapper>
          <StreetWrapper
            onPress={() => {
              navigation.navigate('ModalNavigation', { screen: 'AddressLocationScreen' });
            }}
            color={error.indexOf('address') !== -1 ? 'red' : null}
          >
            <StreetLineWrapper>
              <ImportantLabelView>
                <LabelText color={error.indexOf('address') !== -1 ? 'red' : null}>
                  Адрес доставки
                </LabelText>
                <ImportantLabel>*</ImportantLabel>
              </ImportantLabelView>

              <ValueText style={{ color: error.indexOf('address') !== -1 ? 'red' : null }}>
                {store.user?.address?.name ?? 'Укажите адрес'}
              </ValueText>
            </StreetLineWrapper>
          </StreetWrapper>

          <FlatWrapper>
            <InputWrapper>
              <ImportantLabelView>
                <LabelText color={error.indexOf('flat') !== -1 ? 'red' : null}>Квартира</LabelText>
                <ImportantLabel>*</ImportantLabel>
              </ImportantLabelView>

              <FlatInput
                editable={store.user.address ? true : false}
                keyboardType={'numbers-and-punctuation'}
                first={true}
                value={store.user.address?.flat ?? ''}
                onChangeText={(text) => store.user.setAddressAdditional('flat', text)}
                color={error.indexOf('flat') !== -1 ? 'red' : null}
              />
            </InputWrapper>

            <InputWrapper>
              <LabelText>Подъезд</LabelText>
              <FlatInput
                editable={store.user.address ? true : false}
                keyboardType={'numbers-and-punctuation'}
                value={store.user.address?.entrance ?? ''}
                onChangeText={(text) => store.user.setAddressAdditional('entrance', text)}
              />
            </InputWrapper>

            <InputWrapper>
              <LabelText>Этаж</LabelText>
              <FlatInput
                editable={store.user.address ? true : false}
                keyboardType={'numeric'}
                value={store.user.address?.floor ?? ''}
                onChangeText={(text) => store.user.setAddressAdditional('floor', text)}
              />
            </InputWrapper>
          </FlatWrapper>
          <CommentWrapper>
            <LabelText>Комментарий</LabelText>
            <CommentInput
              editable={store.user.address ? true : false}
              value={comment}
              onChangeText={(text) => {
                setComment(text);
                AsyncStorage.setItem('orderComment', text);
              }}
              placeholder="Пожелания по доставке"
              placeholderTextColor="#979797"
            />
          </CommentWrapper>

          <DeliveryTimeWrapper>
            <DeliveryTimeHeader>
              <CarIcon />
              <DeliverTextView>
                <LabelText>Дата и время доставки</LabelText>
                <DeliveryTimeValue>Выберите дату и время доставки</DeliveryTimeValue>
              </DeliverTextView>
            </DeliveryTimeHeader>
            <RadioForm
              style={{
                marginTop: 10,
              }}
            >
              {radioInputsArr.map((obj, i) => (
                <RadioButton
                  labelHorizontal={true}
                  key={i}
                  style={{
                    borderRadius: 14,
                    height: 46,
                    width: '90%',
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: 10,
                  }}
                >
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={timeDeliveryAt === obj.value}
                    onPress={(value) => setTimeDeliveryAt(value)}
                    borderWidth={1}
                    buttonInnerColor={'#8356CE'}
                    buttonOuterColor={'#8356CE'}
                    buttonSize={14}
                    buttonOuterSize={18}
                    buttonStyle={{}}
                    buttonWrapStyle={{ marginLeft: 10 }}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => setTimeDeliveryAt(value)}
                    labelStyle={{
                      fontSize: 15,
                      color: timeDeliveryAt === obj.value ? '#8356CE' : '#353535',
                      fontWeight: '500',
                    }}
                    labelWrapStyle={{}}
                  />
                </RadioButton>
              ))}
            </RadioForm>
          </DeliveryTimeWrapper>
        </OrderOptionWrapper>
        <InfoWrapper>
          <InfoView>
            <InfoLogo />
            <InfoText>
              При оплате онлайн сначала деньги заморозятся, а спишутся после сборки и доставки
              заказа. Могут прийти два уведомления от банка.
            </InfoText>
          </InfoView>
          <TouchableOpacity onPress={() => Linking.openURL(`https://pokupkin.me/return`)}>
            <InfoView>
              <InfoLogo />
              <InfoText link>Правила возврата / обмена товаров</InfoText>
            </InfoView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`https://pokupkin.me/delivery-terms`)}>
            <InfoView>
              <InfoLogo />
              <InfoText link>Условия и сроки доставки</InfoText>
            </InfoView>
          </TouchableOpacity>
        </InfoWrapper>
        <AggreementText>
          Нажимая на кнопку «Оплатить» вы соглашаетесь с{' '}
          <LinkText onPress={() => Linking.openURL(`https://pokupkin.me/oferta`)}>
            Условиями использования сервиса и публичная оферта,{' '}
            <LinkText onPress={() => Linking.openURL(`https://pokupkin.me/policy`)}>
              Политикой обработки персональных данных.
            </LinkText>
          </LinkText>
        </AggreementText>
      </OrderWrapper>
    </Wrapper>
  );
};

export default observer(CartCreateOrder);

const Wrapper = styled.View`
  flex: 1;
  background-color: #ffffff;
  border-radius: 16px;
  margin-bottom: 30px;
`;
const OrderWrapper = styled.ScrollView`
  flex: 1;
`;
const OrderOptionWrapper = styled.View`
  padding: 0 15px;
`;
const StreetWrapper = styled.TouchableOpacity`
  flex-direction: row;
  padding: 15px 0;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => (props.color !== 'red' ? '#e5e5e5' : 'red')};
`;
const StreetLineWrapper = styled.View`
  flex: 1;
`;
const LabelText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.color !== 'red' ? '#979797' : 'red')};
  font-weight: 500;
`;
const ValueText = styled.Text`
  margin-top: 6px;
  font-size: 15px;
`;

const FlatWrapper = styled.View`
  flex-direction: row;
  margin-top: 15px;
  justify-content: space-between;
  height: 57px;
`;
const FlatInput = styled.TextInput`
  font-size: 14px;
  border-bottom-width: 1px;
  border-color: ${(props) => (props.color !== 'red' ? '#e5e5e5' : 'red')};
  color: #000000;
  margin-top: 6px;
  padding-bottom: 8px;
`;
const CommentWrapper = styled.View`
  border-bottom-width: 1px;
  border-color: #e5e5e5;
  margin-top: 12px;
`;
const CommentInput = styled.TextInput`
  font-size: 13px;
  margin-top: 6px;
  padding-bottom: 8px;
  font-weight: 400;
`;
const DeliveryTimeWrapper = styled.View`
  margin-top: 12px;
  background-color: #eeeeee;
  border-radius: 8px;
  padding-vertical: 11px;
`;
const DeliverTextView = styled.View`
  margin-left: 12px;
`;
const DeliveryTimeValue = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
`;
const InfoWrapper = styled.View`
  margin-horizontal: 14px;
  margin-top: 10px;
`;
const InfoView = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin-bottom: 5px;
`;
const InfoText = styled.Text`
  font-size: 10px;
  font-weight: 400;
  margin-left: 4px;
  color: #979797;
  text-align: left;
  margin-right: 15px;
  text-decoration-line: ${(props) => (props.link ? 'underline' : 'none')};
`;
const AggreementText = styled.Text`
  font-size: 10px
  font-weight: 400
  text-align: center
  color: #979797
  margin-top: 20px
  margin-bottom: 10px
  margin-horizontal: 20px
`;
const LinkText = styled.Text`
  color: #8356ce;
`;
const InputWrapper = styled.View`
  width: 23%;
`;
const ImportantLabelView = styled.View`
  flex-direction: row;
`;
const ImportantLabel = styled.Text`
  color: #eb4d3d;
  font-size: 10px;
  margin-left: 2px;
`;
const DeliveryTimeHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 15px;
`;
