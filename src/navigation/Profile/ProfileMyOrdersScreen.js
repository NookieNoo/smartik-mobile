import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store/Context';
import styled from 'styled-components';
import OrderStatus from '../../store/helper/OrderStatus';
import { formatPrice } from '../../config/helper';
import ArrowRightButtonIcon from '../../assets/svg/icon/ArrowRightButtonIcon';

const ProfileMyOrdersScreen = () => {
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#F7F7F7',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
  }, []);

  const OrderItem = ({ item }) => (
    <Order
      onPress={() =>
        navigation.navigate('ModalNavigation', { screen: 'OrderScreen', params: { order: item } })
      }
    >
      <LeftSide>
        <Text style={{ fontSize: 17 }}>Заказ {item.name}</Text>
        <Text style={{ marginTop: 5, color: '#8E8E93' }}>
          {OrderStatus[item.status].name.split(':')[0]}
        </Text>
      </LeftSide>
      <RightSide>
        <Price>{formatPrice(item.sum_final)}</Price>
        <StatusDescription color={OrderStatus[item.status].color}>
          {OrderStatus[item.status].name.split(':')[1]}
        </StatusDescription>
      </RightSide>
      <ArrowRightButtonIcon />
    </Order>
  );

  if (!store.user.confirmed) {
    return (
      <Wrapper>
        <EmptyWrapper>
          <Title>Чтобы увидеть свои заказы,{'\n'}авторизйтесь</Title>
          <AuthButton
            onPress={() =>
              navigation.navigate('ModalNavigation', {
                screen: 'LoginPhoneScreen',
              })
            }
          >
            <AuthButtonText>Авторизоваться</AuthButtonText>
          </AuthButton>
        </EmptyWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <FlatList
        data={store.order.items}
        renderItem={({ item }) => <OrderItem item={item} />}
        refreshControl={
          <RefreshControl refreshing={store.user.loading} onRefresh={() => store.user.auth()} />
        }
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}
      />
    </Wrapper>
  );
};

export default observer(ProfileMyOrdersScreen);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #f7f7f7;
`;
const Order = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #efeff4;
`;
const LeftSide = styled(View)`
  flex: 1;
`;
const RightSide = styled(View)`
  align-items: flex-end;
  margin-right: 10px;
`;
const Price = styled(Text)`
  font-size: 17px;
`;

const StatusDescription = styled(Text)`
  margin-top: 5px;
  color: ${(props) => props.color ?? '#000000'};
`;
const EmptyWrapper = styled(View)`
  width: 85%;
  border-radius: 8px;
  background-color: #ffffff;
  align-self: center;
  margin-top: 40px;
  align-items: center;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 5px 5px;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
`;
const Title = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  color: #979797;
  margin-top: 20px;
  text-align: center;
`;
const AuthButton = styled(TouchableOpacity)`
  margin-bottom: 20px;
  background-color: #8356ce;
  border-radius: 8px;
  margin-top: 28px;
`;
const AuthButtonText = styled(Text)`
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: 500;
  padding-vertical: 15px;
  padding-horizontal: 20px;
  color: #ffffff;
`;
