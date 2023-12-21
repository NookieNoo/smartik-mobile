import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import Http from '../../initialize/Http';
import { useStore } from '../../store/Context';
import styled from 'styled-components/native';
import CartTotal from '../Cart/component/CartTotal';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Price from '../../component/Price';
import InfoLogo from '../../assets/svg/icon/InfoLogo';
import { formatPrice } from '../../config/helper';
import CarIcon from '../../assets/svg/icon/CarIcon';

const OrderCreateScreen = () => {
  const navigation = useNavigation();
  const store = useStore();

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [error, setError] = useState([]);

  useEffect(() => {
    (async () => {
      const asyncComment = await AsyncStorage.getItem('orderComment');
      if (asyncComment?.length) setComment(asyncComment);
    })();
  }, []);

  useEffect(() => {
    if (store.user.address) {
      setError([]);
    }
  }, [store.user.address]);

  const makeOrder = async () => {
    setLoading(true);
    await store.cart.info();
    if (
      store.cart.products.findIndex((_product) => _product.count > _product.available_count) >= 0
    ) {
      Alert.alert(
        'Проблемка',
        'К сожалению какие-то продукты закончились. Пожалуйста, откорректируйте корзину и попробуйте заново 🙏',
        [{ text: 'OK' }]
      );

      setLoading(false);
    } else {
      publishOrder();
    }
  };

  const publishOrder = async () => {
    setError([]);
    const errors = [];
    if (!store.user.address) errors.push('address');
    setError(errors);

    if (!errors.length) {
      setLoading(true);
      await Http.post('/profile/address', store.user.address);
      const result = await Http.post('/order', { comment });

      setLoading(false);

      if (!result.success) {
        return alert(
          'К сожалению какие-то продукты закончились. Вернитесь назад, удалите из корзины те позиции которые закончились и попробуйте заново.'
        );
      }

      store.app.setAnalyticEvent('page_order_create_order');
      navigation.navigate('OrderPayScreen', {
        uri: result.data.payment.extra.paylink,
        name: result.data.name,
      });
    } else {
      Alert.alert('Ошибка', 'Заполните, пожалуйста, ваш адрес и заполните все обязательные поля', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <Wrapper>
      <OrderWrapper>
        <OrderOptionWrapper>
          <StreetWrapper
            onPress={() => {
              navigation.navigate('ModalNavigation', { screen: 'AddressLocationScreen' });
            }}
          >
            <StreetLineWrapper>
              <ImportantLabelView>
                <LabelText>Адрес доставки</LabelText>
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
                <LabelText>Квартира</LabelText>
                <ImportantLabel>*</ImportantLabel>
              </ImportantLabelView>

              <FlatInput
                editable={store.user.address ? true : false}
                keyboardType={'numbers-and-punctuation'}
                first={true}
                value={store.user.address?.flat ?? ''}
                onChangeText={(text) => store.user.setAddressAdditional('flat', text)}
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
                keyboardType={'number-pad'}
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
            <CarIcon />
            <DeliverTextView>
              <LabelText>Время доставки</LabelText>
              <DeliveryTimeValue>
                {dayjs(store.cart.delivery_at).format('DD MMMM')}, с {store.cart.delivery_time[0]}
                :00 до {store.cart.delivery_time[1]}:00
              </DeliveryTimeValue>
            </DeliverTextView>
          </DeliveryTimeWrapper>
        </OrderOptionWrapper>
        <CartTotal withInfo={false} order={true} />
        <CheckDash ellipsizeMode="clip" numberOfLines={1}>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - -
        </CheckDash>
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

      <PaymentWrapper>
        <PaymentButton onPress={makeOrder}>
          {loading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <PaymentTextPrice>
              <PaymentButtonText>Оплатить</PaymentButtonText>
              <PriceFinal>{formatPrice(store.cart.sum_final)}</PriceFinal>
            </PaymentTextPrice>
          )}
        </PaymentButton>
        <PaymentMethods>
          <PaymentMethodImage source={require('../../assets/png/payMethods.png')} />
          <PaymentMethodText>Принимаем к оплате</PaymentMethodText>
        </PaymentMethods>
      </PaymentWrapper>
    </Wrapper>
  );
};

export default observer(OrderCreateScreen);

const Wrapper = styled.View`
  flex: 1;
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
  border-bottom-color: #e5e5e5;
`;
const StreetLineWrapper = styled.View`
  flex: 1;
`;
const LabelText = styled.Text`
  font-size: 12px;
  color: #979797;
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
  border-color: #e5e5e5;
  color: #000000;
  margin-top: 6px;
  padding-bottom: 8px;
`;
const PaymentWrapper = styled.View`
  padding: 10px 15px 30px;
`;
const PaymentButtonText = styled.Text`
  font-weight: 500;
  color: #fff;
  font-size: 17px;
`;
const PaymentButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: #7b4ede;
  height: 50px;
  border-radius: 14px;
`;
const PaymentMethods = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  justify-content: center;
`;
const PaymentMethodText = styled.Text`
  font-size: 10px;
  color: #979797;
  margin-left: 10px;
  font-weight: 400;
`;
const PaymentMethodImage = styled.Image`
  height: 24px;
  width: 80px;
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
  flex-direction: row;
  align-items: center;
  padding-vertical: 11px;
  padding-left: 15px;
`;
const DeliverTextView = styled.View`
  margin-left: 12px;
`;
const DeliveryTimeLabel = styled.Text`
  font-size: 12px;
  color: #8e8e93;
`;
const DeliveryTimeValue = styled.Text`
  margin-top: 6px;
  font-size: 14px;
  font-weight: 500;
`;
const PriceFinal = styled(Price)`
  font-weight: 700;
  color: #ffffff;
  font-size: 20px;
`;
const PaymentTextPrice = styled.View`
  flex-direction: row;
  width: 60%
  justify-content: space-evenly
  align-items: center
`;
const CheckDash = styled.Text`
  color: #c7c7cc;
  margin-top: 0px;
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
