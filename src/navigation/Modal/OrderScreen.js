import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import Http from '../../initialize/Http';
import Loading from '../../component/Loading';
import sleep from '../../component/sleep';
import dayjs from 'dayjs';
import OrderCard from '../../component/template/ProductCard/OrderCard';
import { useStore } from '../../store/Context';
import styled from 'styled-components';
import { formatPrice, plural } from '../../config/helper';
import ChatIcon from '../../assets/svg/icon/ChatIcon';
import BillIcon from '../../assets/svg/icon/BillIcon';
import CarIcon from '../../assets/svg/icon/CarIcon';
import ArrowDownIcon from '../../assets/svg/icon/ArrowDownIcon';
import ArrowUpIcon from '../../assets/svg/icon/ArrowUpIcon';
import OrderCurrentStatus from '../../store/helper/OrderCurrentStatus';
import Price from '../../component/Price';
import InfoLogo from '../../assets/svg/icon/InfoLogo';
import OrderPaymentStatus from '../../store/helper/OrderPaymentStatus';
import CloseIcon from '../../assets/svg/icon/CloseIcon';
import BackButtonIcon from '../../assets/svg/icon/BackButtonIcon';
import OrderMainStatus from '../../store/helper/OrderMainStatus';
import PhoneIcon from '../../assets/svg/icon/PhoneIcon';
import CancelIcon from '../../assets/svg/icon/CancelIcon';
import LocationIcon from '../../assets/svg/icon/LocationIcon';

//@FIXME Вынести это, или придумать, как объединить со стором в корзине
const sumProductsFull = (products) => {
  let sum = 0;
  products
    .filter((product) => !product.is_deleted)
    .map((product) => {
      if (product.is_deleted) return;
      sum = sum + product.count * (product.price + product.discount);
    });
  return sum;
}

const getTotalPercent = (cart) => {
  return (1 - cart.sum_products / sumProductsFull(cart.products)) * 100;
}

const sumDiscount = (products) => {
  let sum = 0;
  products
    .filter((product) => !product.is_deleted)
    .map((product) => {
      if (product.is_deleted) return;
      sum = sum + product.count * product.discount;
    });
  return sum;
}

const OrderScreen = ({ route }) => {
  const store = useStore();
  const navigation = useNavigation();
  const { order } = route.params;

  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [data, setData] = useState(null);

  const anim = useRef(new Animated.Value(0)).current;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const animHeigth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [61, 185],
  });

  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const opacityValue = opacityAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const bottomAnimation = useRef(new Animated.Value(0)).current;
  const bottomValue = bottomAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

console.log('sdfdsf', data?.cart.sum_products, data?.cart.sum_final, data?.cart.promo_discount);


  const onCollapse = () => {
    if (!isCollapsed) {
      setIsCollapsed(true);
      Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
      Animated.timing(bottomAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      setIsCollapsed(false);
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
      Animated.timing(bottomAnimation, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const getOrder = async () => {
    setLoading(true);
    await sleep(500);
    const result = await Http.get('/order/' + order.uuid);
    if (result.success) {
      setData(result.data);
      navigation.setOptions({ headerTitle: `Заказ № ${result.data.name}` });
    }
    setLoading(false);
  };

  const cancelOrder = async () => {
    Alert.alert('Отменить заказ?', 'Нам очень жаль, что вы хотите отменить заказ.', [
      {
        text: 'Не отменять',
        style: 'cancel',
      },
      {
        text: 'Отменить заказ',
        onPress: async () => {
          setCancelLoading(true);
          const result = await Http.post('/order/' + order.uuid + '/cancel');
          if (result.success) setData(result.data);
          await store.user.auth();
          setCancelLoading(false);
        },
        style: 'destructive',
      },
    ]);
  };

  const HeaderComponent = () => (
    <>
      <PaddingView>
        <AddressView>
          <LocationIcon />
          <AddressText>{data.address.address}</AddressText>
        </AddressView>
      </PaddingView>
      <BorderView />
      <ChatBillView>
        <CircleButtonView onPress={() => Linking.openURL('whatsapp://send?phone=+79035127680')}>
          <CircleButton>
            <ChatIcon />
          </CircleButton>
          <CircleButtonText>Чат{'\n'}поддержки</CircleButtonText>
        </CircleButtonView>

        {data?.checks.length > 0 &&
          data.checks.filter((item) => item.url && ['final', 'hold'].includes(item.type)).length >
            0 && (
            <CircleButtonView
              onPress={() =>
                Linking.openURL(
                  data.checks
                    .filter((item) => item.url && ['final', 'hold'].includes(item.type))
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].url
                )
              }
            >
              <CircleButton>
                <BillIcon />
              </CircleButton>
              <CircleButtonText>Чек</CircleButtonText>
            </CircleButtonView>
          )}
      </ChatBillView>
      <Animated.View
        style={{
          width: '90%',
          height: animHeigth,
          backgroundColor: '#EEEEEE',
          alignSelf: 'center',
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <CurrentStatusPress onPress={onCollapse}>
          <CurrentIconTextView>
            <CarIcon />
            <CurrentTextView>
              <CurrentTitle>Дата и время доставки</CurrentTitle>
              <CurrentTimeText>
                {dayjs(data.delivery_at).format('D MMMM')}, с {data.delivery_time[0][0]}:00 до{' '}
                {data.delivery_time[0][1]}:00
              </CurrentTimeText>
            </CurrentTextView>
          </CurrentIconTextView>

          {isCollapsed ? <ArrowDownIcon /> : <ArrowUpIcon />}
        </CurrentStatusPress>

        <Animated.View
          style={{
            bottom: bottomValue,
            opacity: opacityValue,
          }}
        >
          <StatusView>
            <StatusWrapper>
              <DotView>
                {handleStatus(data.status) === 0 ? (
                  <BigDot />
                ) : (
                  <SmallDot passed={handleStatus(data.status) >= 0} />
                )}
              </DotView>
              <StatusText passed={handleStatus(data.status) >= 0}>Оформлен</StatusText>
            </StatusWrapper>
            <DotConnector top={12} passed={handleStatus(data.status) >= 1} />
            <StatusWrapper>
              <DotView>
                {handleStatus(data.status) === 1 ? (
                  <BigDot />
                ) : (
                  <SmallDot passed={handleStatus(data.status) >= 1} />
                )}
              </DotView>
              <StatusText passed={handleStatus(data.status) >= 1}>Собираем заказ</StatusText>
            </StatusWrapper>
            <DotConnector top={32} passed={handleStatus(data.status) >= 2} />
            <StatusWrapper>
              <DotView>
                {handleStatus(data.status) === 2 ? (
                  <BigDot />
                ) : (
                  <SmallDot passed={handleStatus(data.status) >= 2} />
                )}
              </DotView>
              <StatusText passed={handleStatus(data.status) >= 2}>Передан в доставку</StatusText>
            </StatusWrapper>
            <DotConnector top={53} passed={handleStatus(data.status) >= 3} />
            <StatusWrapper>
              <DotView>
                {handleStatus(data.status) === 3 ? (
                  <BigDot />
                ) : (
                  <SmallDot passed={handleStatus(data.status) >= 3} />
                )}
              </DotView>
              <StatusText passed={handleStatus(data.status) >= 3}>В пути</StatusText>
            </StatusWrapper>
            <DotConnector top={74} passed={handleStatus(data.status) >= 4} />
            <StatusWrapper>
              <DotView>
                {handleStatus(data.status) === 4 ? (
                  <BigDot />
                ) : (
                  <SmallDot passed={handleStatus(data.status) >= 4} />
                )}
              </DotView>
              <StatusText passed={handleStatus(data.status) >= 4}>Доставлен</StatusText>
            </StatusWrapper>
          </StatusView>
        </Animated.View>
      </Animated.View>

      <DeliveryPhoneButton disabled={data?.forwarder_phone ? false : true} onPress={() => Linking.openURL(`tel:${data.forwarder_phone}`)}>
        <PhoneIcon size="22" />
        <DeliveryPhoneTextView>
          <DeliveryPhoneTitle>Уточнить время доставки</DeliveryPhoneTitle>
          <DeliveryPhoneText>Связаться с водителем{!data?.forwarder_phone && "\n(Телефон появится позже)"}</DeliveryPhoneText>
        </DeliveryPhoneTextView>
      </DeliveryPhoneButton>

      <PaddingView>
        <ItemCountView>
          <ItemCountTitle>
            {plural(data.cart?.products?.length, ['товар', 'товара', 'товаров'])} стоимостью
          </ItemCountTitle>
          <ItemCountPrice>{formatPrice(data.sum_products)}</ItemCountPrice>
        </ItemCountView>
        <ItemSubtitle>
          Если какого-то товара не окажется в наличии, вам придет Пуш-уведомление. Деньги за этот
          товар не будут списаны. Итоговую сумму вы можете посмотреть в чеке.
        </ItemSubtitle>
      </PaddingView>
    </>
  );

  const FooterComponent = () => (
    <View style={{ marginTop: 20 }}>
      <PaddingView>
        <CheckLine>
          <TextLabel>
            {plural(data.cart?.products?.length, ['товар', 'товара', 'товаров'])} -{' '}
            {data.cart?.products?.length} шт
          </TextLabel>
          <DiscountText>{formatPrice(sumProductsFull(data.cart.products))}</DiscountText>
        </CheckLine>
        <CheckLine>
          <DiscountView>
            <TextLabel>Ваша скидка</TextLabel>
            <PercentView>
              <TextPercent>
                {getTotalPercent(data.cart).toFixed(0)} %
              </TextPercent>
            </PercentView>
          </DiscountView>

          {/* <TextValue red>- {formatPrice(data.cart.sum_final - data.cart.sum_products)}</TextValue> */}
          <TextValue red>- {formatPrice(sumDiscount(data.cart.products))}</TextValue>
        </CheckLine>
        <CheckLine>
          <TextLabel>Стоимость со скидкой</TextLabel>
          <TextValue>{formatPrice(data.cart.sum_products + data.cart.promo_discount)}</TextValue>
        </CheckLine>
        {data.cart.promo_discount > 0 ? (
          <CheckLine>
            <TextLabel>Промокод</TextLabel>
            <TextValue red>- {formatPrice(data.cart.promo_discount)}</TextValue>
          </CheckLine>
        ) : null}
        <CheckDash ellipsizeMode="clip" numberOfLines={1}>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - -
        </CheckDash>
        <CheckLine>
          <TextLabel big>Итого</TextLabel>
          <TextValue big>{formatPrice(data.sum_final)}</TextValue>
        </CheckLine>
        <CheckLine>
          <TextLabel>Доставка</TextLabel>
          <TextValue>
            {data.delivery_price === 0 ? 'Бесплатно' : formatPrice(data.delivery_price)}
          </TextValue>
        </CheckLine>
        <CheckDash ellipsizeMode="clip" numberOfLines={1}>
          - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          - - - - - - - - - - - -
        </CheckDash>
      </PaddingView>
      <InfoWrapper>
        <InfoView>
          <InfoLogo />
          <InfoText>
            Внимание! Количество товаров может измениться, так как сервис не может гарантировать их
            наличие у производителя.
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
    </View>
  );

  const handleStatus = (type) => {
    return OrderCurrentStatus[type].index;
  };

  if (loading || !data) return <Loading />;

  return (
    <Wrapper>
      <PaddingView>
        <HeaderView>
          <BackButton onPress={goBack}>
            <BackButtonIcon />
          </BackButton>
          <HeaderTitle>{`Заказ № ${data?.name ?? ''}`}</HeaderTitle>
          <CloseButton onPress={goBack}>
            <CloseIcon />
          </CloseButton>
        </HeaderView>
      </PaddingView>
      <PaddingView>
        <OrderDateText>
          Дата заказа {dayjs(data.delivery_at).format('D MMMM')}, с {data.delivery_time[0][0]}:00 до{' '}
          {data.delivery_time[0][1]}:00
        </OrderDateText>
        <OrderStatusView>
          <OrderMainStatusText>{OrderMainStatus[data.status].name}</OrderMainStatusText>
          <OrderPaymentStatusText>{OrderPaymentStatus[data.status].name}</OrderPaymentStatusText>
        </OrderStatusView>
      </PaddingView>
      <BorderView />

      <FlatList
        data={data.cart?.products}
        renderItem={({ item, index }) => (
          <PaddingView>
            <OrderCard product={item} index={index} />
          </PaddingView>
        )}
        keyExtractor={(item, index) => 'route-' + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
        ListHeaderComponent={<HeaderComponent />}
        ListFooterComponent={<FooterComponent />}
      />
      <OrderButtons
        style={{
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 11.95,
          elevation: 18,
        }}
      >
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:+78002006724`)}
          style={{
            flexDirection: 'row',
            backgroundColor: '#F6F6F6',
            width: '50%',
            borderRadius: 8,
            alignItems: 'center',
            paddingVertical: 9,
            paddingHorizontal: 15,
          }}
        >
          <PhoneIcon size="20" />
          <Text style={{ marginLeft: 10, fontSize: 14 }}>Связаться с поддержкой</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => cancelOrder()}
          disabled={
            cancelLoading ||
            ['canceled:manager', 'canceled:driver', 'canceled:user', 'done'].includes(data.status)
          }
          style={{
            opacity: ['canceled:manager', 'canceled:driver', 'canceled:user', 'done'].includes(
              data.status
            )
              ? 0.3
              : 1,
            flexDirection: 'row',
            marginLeft: 10,
            width: '50%',
            backgroundColor: '#F6F6F6',
            borderRadius: 8,
            alignItems: 'center',
            paddingVertical: 9,
            paddingHorizontal: 15,
          }}
        >
          {cancelLoading ? (
            <Loading />
          ) : (
            <>
              <CancelIcon />
              <Text style={{ marginLeft: 10, fontSize: 14 }}>Отменить заказ</Text>
            </>
          )}
        </TouchableOpacity>
      </OrderButtons>
    </Wrapper>
  );
};

export default observer(OrderScreen);

const Wrapper = styled.View`
  flex: 1;
`;
const HeaderView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 23px;
  margin-bottom: 25px;
`;
const BackButton = styled.TouchableOpacity``;
const HeaderTitle = styled.Text`
  font-weight: 600;
  font-size: 18px;
  color: #353535;
  letter-spacing: -0.4px;
`;
const CloseButton = styled.TouchableOpacity``;
const OrderButtons = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: #dcdcdc;
  background-color: #fefefe;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  padding-horizontal: 15px;
  padding-top: 15px;
  padding-bottom: 40px;
  shadow-color: #000000;
`;
const OrderDateText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: #8e8e92;
`;
const OrderMainStatusText = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: #8356ce;
  letter-spacing: -0.4px;
`;
const PaddingView = styled.View`
  padding-horizontal: 15px;
`;
const BorderView = styled.View`
  border-bottom-width: 1px;
  border-color: #e3e3e3;
`;
const AddressView = styled.View`
  flex-direction: row;
  padding-vertical: 14px;
  align-items: center;
`;
const AddressText = styled.Text`
  font-weight: 400;
  font-size: 14px;
  color: #353535;
  margin-left: 8px;
  margin-top: 2px;
`;
const ChatBillView = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 18px;
`;
const CircleButtonView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;
const CircleButton = styled.View`
  height: 56px;
  width: 56px;
  border-radius: 28px;
  background-color: #eeeeee;
  justify-content: center;
  align-items: center;
`;
const CircleButtonText = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #8e8e92;
  margin-left: 6px;
  line-height: 14px;
`;
const CurrentStatusPress = styled.Pressable`
  flex-direction: row;
  background-color: #eeeeee;
  border-radius: 8px;
  justify-content: space-between;
  padding-horizontal: 20px;
  align-items: center;
  z-index: 1;
`;
const CurrentIconTextView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
`;
const CurrentTextView = styled.View`
  margin-left: 10px;
  justify-content: space-between;
`;
const CurrentTitle = styled.Text`
  font-weight: 500;
  font-size: 12px;
  color: #979797;
  margin-bottom: 6px;
`;
const CurrentTimeText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #353535;
`;
const StatusView = styled.View`
  margin-left: 20px;
  margin-top: 15px;
  padding-bottom: 16px;
`;
const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  z-index: 1;
`;
const DotView = styled.View`
  flex: 1;
`;
const SmallDot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${(props) => (props.passed ? '#8356CE' : '#979797')};
`;
const BigDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #8356ce;
  margin-left: -2px;
`;
const StatusText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => (props.passed ? '#8356CE' : '#979797')};
  flex: 15;
`;
const DotConnector = styled.View`
  width: 2px;
  background-color: ${(props) => (props.passed ? '#8356CE' : '#979797')};
  height: 21px;
  position: absolute;
  top: ${(props) => props.top}px;
  margin-left: 1px;
  z-index: 0;
`;
const ItemCountView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
`;
const ItemCountTitle = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: #353535;
  letter-spacing: -0.4px;
`;
const ItemCountPrice = styled.Text`
  font-weight: 700;
  font-size: 18px;
  color: #353535;
  letter-spacing: -0.4px;
`;
const ItemSubtitle = styled.Text`
  color: #979797;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.08px;
  margin-top: 6px;
  margin-bottom: 20px;
`;
const CheckLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 7px;
`;
const TextLabel = styled.Text`
  font-size: ${(props) => (props.big ? 17 : 15)}px;
  font-weight: ${(props) => (props.big ? 600 : 'normal')};
  color: ${(props) => (props.big ? '#000' : '#8E8E93')};
`;
const DiscountView = styled.View`
  flex-direction: row;
`;
const PercentView = styled.View`
  background: #8356ce;
  padding-horizontal: 6px;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin-left: 10px;
`;
const TextPercent = styled.Text`
  color: #f6f6f6;
  font-size: 13px;
  font-weight: 500;
  padding-vertical: 3px;
`;
const DiscountText = styled.Text`
  text-decoration-line: line-through;
  color: #8e8e93;
`;
const TextValue = styled(Price)`
  font-size: ${(props) => (props.big ? 17 : 15)}px;
  font-weight: ${(props) => (props.big ? 600 : 500)};
  color: ${(props) => (props.red ? '#FF3B30' : props.green ? '#379a31' : '#000')};
`;
const CheckDash = styled.Text`
  color: #c7c7cc;
  margin-top: 10px;
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
const OrderStatusView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  justify-content: space-between;
`;
const OrderPaymentStatusText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: #8356ce;
  text-align: center;
`;
const DeliveryPhoneButton = styled.TouchableOpacity`
  width: 73%;
  border-radius: 36px;
  background-color: #eeeeee;
  flex-direction: row;
  padding-vertical: 10px;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 20px;
`;
const DeliveryPhoneTextView = styled.View`
  margin-left: 16px;
`;
const DeliveryPhoneTitle = styled.Text`
  font-size: 12px;
  font-weight: 500;
  color: #979797;
  line-height: 14.32px;
  margin-bottom: 3px;
`;
const DeliveryPhoneText = styled.Text`
  color: #353535;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.71px;
`;
