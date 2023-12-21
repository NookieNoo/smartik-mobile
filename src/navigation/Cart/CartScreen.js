import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  View,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import styled from 'styled-components/native';
import Price from '../../component/Price';
import { useStore } from '../../store/Context';
import CustomIcon from '../../component/CustomIcon';
import ProductCard from '../../component/template/ProductCard';
import CartAddMore from './component/CartAddMore';
import CartPromo from './component/CartPromo';
import CartTotal from './component/CartTotal';
import { useIsFocused } from '@react-navigation/native';
import Loading from '../../component/Loading';
import { formatPrice } from '../../config/helper';
import CartSmallIcon from '../../assets/svg/icon/CartSmallIcon';
import LightningIcon from '../../assets/svg/icon/LightningIcon';
import CarIcon from '../../assets/svg/icon/CarIcon';
import CartCreateOrder from './component/CartCreateOrder';
import Http from '../../initialize/Http';
import Colors from '../../initialize/Colors';
import PromoArrowRightIcon from '../../assets/svg/icon/PromoArrowRightIcon';

const CartScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const store = useStore();

  const [checking, setChecking] = useState(false);
  const [error, setError] = useState([]);
  const [comment, setComment] = useState('');
  const [timeDeliveryAt, setTimeDeliveryAt] = useState(2);
  const [avaiPromo, setAvaiPromo] = useState(null);

  const pressedRef = useRef(false);

  useEffect(() => {
    if (store.user.phone && store.user.media_source !== 'CPA-Getblogger') {
      if (store.order.completedOrders > 1) {
        setAvaiPromo(null);
      } else if (store.order.completedOrders === 0) {
        setAvaiPromo('ХОЧУ200');
      } else if (store.order.completedOrders === 1) {
        setAvaiPromo('SUPER200');
      }
    }
  }, [store.order.completedOrders, store.user]);

  useEffect(() => {
    if (isFocused) {
      store.app.setAnalyticEvent('page_cart_main');
      store.cart.info();
    }
  }, [isFocused]);

  useEffect(() => {
    if (store.user.phone) {
      if (pressedRef.current === true && store.order.completedOrders > 1) {
        makeOrder();
      }
    }
  }, [store.user.phone, store.order.completedOrders]);

  const publishOrder = async () => {
    setError([]);
    const errors = [];
    if (!store.user.address) errors.push('address');
    if (!store.user.address?.flat) errors.push('flat');
    setError(errors);

    if (!errors.length) {
      setChecking(true);
      await Http.post('/profile/address', store.user.address);
      const result = await Http.post('/order', { comment, time_delivery_at: timeDeliveryAt });

      if (!result.success) {
        return alert(
          'К сожалению какие-то продукты закончились. Вернитесь назад, удалите из корзины те позиции которые закончились и попробуйте заново.'
        );
      }
      pressedRef.current = false;
      store.app.setAnalyticEvent('page_order_create_order');
      navigation.navigate('ModalNavigation', {
        screen: 'OrderPayScreen',
        params: {
          uri: result.data.payment.extra.paylink,
          name: result.data.name,
        },
      });
      setChecking(false);
    } else {
      Alert.alert('Ошибка', 'Заполните, пожалуйста, ваш адрес и заполните все обязательные поля', [
        { text: 'OK' },
      ]);
    }
  };

  const makeOrder = async () => {
    setChecking(true);
    pressedRef.current = true;
    await store.cart.info();
    if (
      store.cart.products.findIndex((_product) => _product.count > _product.available_count) >= 0
    ) {
      Alert.alert(
        'Проблемка',
        'К сожалению какие-то продукты закончились. Пожалуйста, откорректируйте корзину и попробуйте заново 🙏',
        [{ text: 'OK' }]
      );
    } else {
      if (store.user.phone) {
        publishOrder();
      } else {
        navigation.navigate('ModalNavigation', {
          screen: 'LoginPhoneScreen',
        });
      }
    }
    setChecking(false);
  };

  const enterPromo = () => {
    if (store.cart.sumProducts + store.cart.promo_discount < 1200) {
      Alert.alert(
        'Добавьте продукты',
        'Для применения промодка, сумма заказа должна быть 1200р и выше',
        [{ text: 'Закрыть' }]
      );
    } else {
      store.cart.setPromo(avaiPromo);
      if (store.user.phone) {
        store.cart.setPromo(avaiPromo);
      } else {
        navigation.navigate('ModalNavigation', {
          screen: 'LoginPhoneScreen',
        });
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Wrapper>
        <ProductList>
          <TitleWrapper>
            <Title>Корзина</Title>
            {store.cart.products.length > 0 ? (
              <TrashButton
                onPress={async () => {
                  Alert.alert('Очистить корзину?', '', [
                    {
                      text: 'Отмена',
                      style: 'cancel',
                    },
                    {
                      style: 'destructive',
                      text: 'Очистить',
                      onPress: async () => {
                        store.cart.clear();
                      },
                    },
                  ]);
                }}
              >
                <CustomIcon width={22} height={22} icon="Trash" />
              </TrashButton>
            ) : null}
          </TitleWrapper>
          {store.cart.products.length > 0 ? (
            <>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={store.user.loading}
                    onRefresh={() => store.user.auth()}
                  />
                }
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 100 }}
              >
                <ProductsPromoView>
                  {store.cart.getProducts.map((product, index) => (
                    <AnimatedWrapper
                      entering={FadeIn}
                      exiting={FadeOut}
                      layout={Layout.delay(100)}
                      key={'cart-product-' + product.uuid_price}
                    >
                      <ProductCard product={product} index={index} type={'cart'} />
                    </AnimatedWrapper>
                  ))}
                  <AnimatedWrapper layout={Layout.delay(100)} key={'cart-add-more'}>
                    <CartAddMore />
                  </AnimatedWrapper>
                  <AnimatedWrapper layout={Layout.delay(100)} key={'cart-promo'}>
                    <CartPromo />
                  </AnimatedWrapper>
                </ProductsPromoView>
                <AnimatedWrapper layout={Layout.delay(100)} key={'cart-total'}>
                  <CartTotal
                    style={{
                      backgroundColor: '#F7F7F7',
                      marginTop: 10,
                    }}
                  />
                </AnimatedWrapper>
                <OrderInfoView>
                  <CheckInfo>Бесплатная доставка при заказе от 999₽</CheckInfo>
                  <PriceInfo>Минимальная сумма заказа 500₽ без учета стоимости доставки.</PriceInfo>
                  <CheckInfo>
                    Внимание! Количество товаров может измениться, так как сервис не может
                    гарантировать их наличие у производителя.
                  </CheckInfo>
                </OrderInfoView>
                <CartCreateOrder comment={comment} setComment={setComment} timeDeliveryAt={timeDeliveryAt} setTimeDeliveryAt={setTimeDeliveryAt} error={error} />
              </ScrollView>
              <OrderButtonWrapper>
                {avaiPromo && (
                  <>
                    <PromoWrapper>
                      <PromoTextView>
                        <PromoTopText>Промокод на скидку в 200₽ при заказе от 1200₽</PromoTopText>
                      </PromoTextView>
                    </PromoWrapper>
                    <PromoView>
                      <PromoCodeText>{avaiPromo}</PromoCodeText>
                      <PromoArrowRightIcon />
                      <PromoButton
                        onPress={() => enterPromo()}
                        disable={store.cart.promo_discount > 0}
                      >
                        <PromoButtonText>
                          {store.cart.promo_discount > 0 ? 'Промокод применен' : 'Применить скидку'}
                        </PromoButtonText>
                      </PromoButton>
                    </PromoView>
                  </>
                )}

                <OrderButton
                  disabled={store.cart.sumProducts < store.cart.delivery.possible || checking}
                  onPress={() => makeOrder()}
                >
                  {checking ? (
                    <Loading />
                  ) : (
                    <>
                      <OrderText>Оплатить</OrderText>
                      <PriceFinal>{formatPrice(store.cart.sum_final)}</PriceFinal>
                    </>
                  )}
                </OrderButton>
                {store.cart.sumProducts < store.cart.delivery.possible ? (
                  <MinimalSumWrapper>
                    <LightningIcon />
                    <MinimalSum>
                      Минимальная сумма заказа {formatPrice(store.cart.delivery.possible)}
                    </MinimalSum>
                  </MinimalSumWrapper>
                ) : null}
                {store.cart.delivery_price !== 0 &&
                  store.cart.sumProducts >= store.cart.delivery.possible && (
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        alignSelf: 'center',
                        marginTop: 15,
                      }}
                    >
                      <CarIcon />
                      <Text
                        style={{ marginLeft: 6, fontWeight: '500', color: '#353535', fontSize: 12 }}
                      >
                        Доставка {store.cart.delivery.price}₽ · До бесплатной ещё{' '}
                        {store.cart.deliveryStatus.need.toFixed(0)}₽
                      </Text>
                    </View>
                  )}
                {store.cart.delivery_price === 0 &&
                  store.cart.sumProducts >= store.cart.delivery.possible && (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: 15,
                        flexDirection: 'row',
                        alignSelf: 'center',
                      }}
                    >
                      <CartSmallIcon />
                      <Text
                        style={{ marginLeft: 6, fontWeight: '500', color: '#353535', fontSize: 12 }}
                      >
                        Оформи заказ до 00:00 с доставкой на завтра
                      </Text>
                    </View>
                  )}
              </OrderButtonWrapper>
            </>
          ) : !store.user.loading ? (
            <EmptyData>
              <CustomIcon width={150} height={150} icon="EmptyCart" />
              <EmptyTitle>Корзина пуста</EmptyTitle>
              <Description>
                Перейдите в каталог с товарами, чтобы выбрать понравившиеся и сделать заказ.
              </Description>
            </EmptyData>
          ) : null}
        </ProductList>
      </Wrapper>
    </SafeAreaView>
  );
};

export default observer(CartScreen);

const Wrapper = styled.View`
  flex: 1;
  background-color: #f7f7f7;
`;
const AnimatedWrapper = styled(Animated.View)`
  flex: 1;
`;
const TrashButton = styled.TouchableOpacity``;
const ProductList = styled.View`
  flex: 1;
  margin-top: 16px;
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  padding: 0 15px;
  align-items: center;
  margin-bottom: 16px;
`;
const Title = styled.Text`
  flex: 1;
  font-weight: 700;
  font-size: 20px;
`;
const OrderButtonWrapper = styled.View`
  position: absolute;
  bottom: 0;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  width: 100%;
  background-color: #fefefe;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  padding: 15px 10px;
  shadow-color: #000;
  shadow-offset: 0px 9px;
  shadow-opacity: 0.5;
  shadow-radius: 12px;
`;
const OrderButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  background-color: ${(props) => (props.disabled ? '#7B4EDE30' : '#7B4EDE')};
  border-radius: 14px;
`;
const OrderText = styled.Text`
  font-weight: 500;
  color: #ffffff;
  font-size: 17px;
`;
const PriceFinal = styled(Price)`
  font-weight: 700;
  color: #ffffff;
  font-size: 20px;
`;
const EmptyData = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const EmptyTitle = styled(Text)`
  margin-top: 60px;
  font-weight: 700;
  font-size: 23px;
`;
const Description = styled(Text)`
  margin-top: 7px;
  padding-horizontal: 40px;
  font-size: 17px;
  color: #8e8e93;
  text-align: center;
`;
const MinimalSumWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 15px;
`;
const MinimalSum = styled(Text)`
  font-size: 12px;
  font-weight: 500;
  color: #353535;
  margin-left: 10px;
`;
const ProductsPromoView = styled.View`
  background-color: #fff;
  padding-vertical: 18px;
  border-radius: 16px;
`;
const CheckInfo = styled.Text`
  flex: 1;
  font-size: 11px;
  color: #353535;
`;
const PriceInfo = styled.Text`
  flex: 1;
  font-size: 11px;
  color: #353535;
  margin-vertical: 6px;
`;
const OrderInfoView = styled.View`
  background-color: ${Colors.cartInfoBackground};
  border-radius: 8px;
  padding-horizontal: 14px;
  padding-vertical: 10px;
  margin-horizontal: 14px;
  margin-bottom: 14px;
  margin-top: 10px;
`;
const PromoWrapper = styled.View`
  position: absolute;
  top: 0px;
  width: ${Dimensions.get('screen').width}px;
`;
const PromoTextView = styled.View`
  background-color: #8356ce;
  padding-vertical: 4px;
  align-items: center;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
`;
const PromoTopText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  line-height: 13.13px;
  letter-spacing: -0.08px;
`;
const PromoView = styled.View`
  flex-direction: row;
  width: 100%;
  padding-horizontal: 13px;
  align-items: center;
  justify-content: space-between;
  margin-vertical: 16px;
`;
const PromoCodeText = styled.Text`
  font-size: 30px;
  font-weight: 700;
  color: #8356ce;
  letter-spacing: -0.53px;
`;
const PromoButton = styled.TouchableOpacity`
  background-color: #eeeeee;
  border-radius: 5px;
`;
const PromoButtonText = styled.Text`
  color: #353535;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.23px;
  padding-vertical: 6px;
  padding-horizontal: 10px;
`;
