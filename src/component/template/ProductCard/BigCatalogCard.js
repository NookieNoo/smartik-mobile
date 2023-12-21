import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TextInput } from 'react-native';
import styled from 'styled-components/native';
import config from '../../../config';
import { useStore } from '../../../store/Context';
import { toJS } from 'mobx';
import dayjs from 'dayjs';
import { formatPrice } from '../../../config/helper';
import { debounce } from 'lodash';
import ProductMinusIcon from '../../../assets/svg/icon/ProductMinusIcon';
import ProductPlusIcon from '../../../assets/svg/icon/ProductPlusIcon';

const BigCatalogCard = ({ product, price, ...props }) => {
  const navigation = useNavigation();
  const store = useStore();
  const cart = store.cart.products.find((item) => item.uuid_price === price.uuid);
  const [count, setCount] = useState(cart?.count ?? null);

  const disablePlus = store.cart.isDisabledButton({
    type: 'plus',
    uuid: price.uuid,
    limit: cart?.limit,
    count: cart?.count,
  });

  const disableMinus = store.cart.isDisabledButton({
    type: 'minus',
    uuid: price.uuid,
    limit: cart?.limit,
    count: cart?.count,
  });

  const handler = useCallback(
    debounce((val) => {
      updateCartCount(val);
    }, 3000),
    []
  );

  const incAddHandler = useCallback(
    debounce((val) => {
      let limit = store.cart.products.find((item) => item.uuid_price === price.uuid)?.limit;
      if (val > limit) {
        store.cart.changeCount(price.uuid, limit);
      } else {
        store.cart.changeCount(price.uuid, val);
      }
    }, 2000),
    []
  );

  const incMinusHandler = useCallback(
    debounce((val) => {
      store.cart.changeCount(price.uuid, val);
    }, 2000),
    []
  );

  useEffect(() => {
    setCount(cart?.count ?? null);
  }, [cart]);

  const updateCartCount = (number) => {
    if (number.trim() !== '') {
      if (store.cart.products.find((item) => item.uuid_price === price.uuid)?.limit < number) {
        store.cart.changeCount(
          price.uuid,
          store.cart.products.find((item) => item.uuid_price === price.uuid)?.limit
        );
      } else {
        store.cart.changeCount(price.uuid, number.trim());
      }
    } else {
      store.cart.changeCount(price.uuid, 0);
    }
  };

  return (
    <Wrapper>
      <Button onPress={() => navigation.navigate('ProductScreen', { uuid: product.uuid })}>
        <Image
          resizeMode={'contain'}
          source={{ uri: config.imageUrl + '/media/product/' + product.uuid + '/big' }}
        />
        <InfoView>
          <Discount>
            <DiscountValue>-{toJS(product.prices[0].discount_percent)}%</DiscountValue>
          </Discount>
          <Expire>
            <ExpireDate>Годен до {dayjs(product.prices[0].expired_at).format('D MMMM')}</ExpireDate>
          </Expire>
          <Prices>
            <Price>{formatPrice(price.price)}</Price>
            <OldPrice>{formatPrice(price.price_old)}</OldPrice>
          </Prices>

          <Label numberOfLines={3}>{product.name}</Label>
          <WeightText>
            {product.weight} {product.weight_type}
          </WeightText>
          <CardButtonWrapper>
            {cart ? (
              <>
                <CartButtonInc
                  onPress={() => {
                    if (!disableMinus) {
                      setCount((val) => {
                        if (val === 1) {
                          store.cart.changeCount(price.uuid, 0);
                        } else {
                          incMinusHandler(val - 1);
                        }
                        return val - 1;
                      });
                    }
                  }}
                  opacity={disableMinus}
                >
                  <ProductMinusIcon color={disableMinus ? 'transparent' : '#fff'} />
                </CartButtonInc>
                <CartCountWrapper>
                  {store.cart.count.loading && store.cart.count.uuid === price.uuid ? (
                    <ActivityIndicator />
                  ) : (
                    <TextInput
                      value={count?.toString() ?? 0}
                      style={{
                        fontSize: 22,
                        fontWeight: '500',
                        color: '#8356ce',
                        borderBottomWidth: 1,
                        borderColor: '#8356ce',
                        width: 40,
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                      onChangeText={(val) => {
                        setCount(val);
                        handler(val);
                      }}
                      keyboardType="numeric"
                      selection={{
                        start: count?.toString().length,
                      }}
                    />
                  )}
                </CartCountWrapper>
                <CartButtonInc
                  onPress={() => {
                    if (!disablePlus) {
                      setCount((val) => {
                        incAddHandler(val + 1);

                        return val + 1;
                      });
                    }
                  }}
                  opacity={disablePlus}
                >
                  <ProductPlusIcon color={disablePlus ? 'transparent' : '#fff'} />
                </CartButtonInc>
              </>
            ) : (
              <CartButton
                onPress={() => store.cart.changeCount(price.uuid, 1)}
                disabled={store.cart.count.loading && store.cart.count.uuid === price.uuid}
              >
                {store.cart.count.loading && store.cart.count.uuid === price.uuid ? (
                  <ActivityIndicator />
                ) : (
                  <CartText>В корзину</CartText>
                )}
              </CartButton>
            )}
          </CardButtonWrapper>
        </InfoView>
      </Button>
    </Wrapper>
  );
};

export default observer(BigCatalogCard);

const Wrapper = styled.View`
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
`;
const Button = styled.TouchableOpacity`
  flex: 1;
  margin: 8px;
`;
const Image = styled.Image`
  width: 100%;
  height: 132px;
`;
const Label = styled.Text`
  font-size: 15px;
  font-weight: 400;
  text-align: left;
  line-height: 16px;
  letter-spacing: -0.4px;
  margin-top: 8px;
`;
const Prices = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;
const Price = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;
const OldPrice = styled.Text`
  margin-left: 5px;
  font-size: 13px;
  font-weight: 400;
  color: #9d9b98;
  text-decoration-line: line-through;
  text-decoration-style: solid;
  margin-top: 2px;
`;
const Discount = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 3px;
  border-radius: 4px;
  background-color: #fc5230;
  align-self: flex-start;
`;
const DiscountValue = styled.Text`
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
`;
const Expire = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 3px;
  background-color: #bee224;
  align-self: flex-start;
  margin-top: 5px;
`;
const ExpireDate = styled.Text`
  color: #333333;
  font-size: 12px;
  font-weight: 500;
`;
const CartButton = styled.TouchableOpacity`
  background: #e2e2e2;
  flex: 1;
  padding: 0px 10px;
  height: 40px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
`;
const CartText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;
const CardButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  bottom: 0px;
  align-self: flex-end;
  position: absolute;
`;
const CartButtonInc = styled.Pressable`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: #8356ce;
  border-radius: 7px;
  opacity: ${(props) => (props.opacity ? '0.5' : '1.0')};
`;
const CartCountWrapper = styled.View`
  flex: 1;
  align-items: center;
`;
const CartCount = styled.Text`
  font-weight: 500;
  font-size: 22px;
  color: #8356ce;
`;
const InfoView = styled.View`
  position: absolute;
  height: 206px;
  bottom: 0px;
  width: 100%;
`;
const WeightText = styled.Text`
  font-weight: 400;
  font-size: 12px;
  color: #9d9b98;
  position: absolute;
  bottom: 48px;
`;
