import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import Price from '../../../component/Price';
import { plural, formatPrice, formatIntegerPrice } from '../../../config/helper';
import { useStore } from '../../../store/Context';

const CartTotal = ({ withInfo = true, style = {}, order = false }) => {
  const store = useStore();

  return (
    <Wrapper style={style}>
      <CheckLine>
        <TextLabel>
          {plural(store.cart.products.length, ['товар', 'товара', 'товаров'])} -{' '}
          {store.cart.getTotalCount} шт
        </TextLabel>
        <DiscountText>{formatPrice(store.cart.sumProductsFull)}</DiscountText>
      </CheckLine>
      <CheckLine>
        <DiscountView>
          <TextLabel>Ваша скидка</TextLabel>
          <PercentView>
            <TextPercent>-{store.cart.getTotalPercent.toFixed(0)}%</TextPercent>
          </PercentView>
        </DiscountView>

        <TextValue red>- {formatPrice(store.cart.sumDiscount)}</TextValue>
      </CheckLine>
      <CheckLine>
        <TextLabel>Стоимость со скидкой</TextLabel>
        <TextValue>{formatPrice(store.cart.sumProducts + store.cart.promo_discount)}</TextValue>
      </CheckLine>

      {store.cart.promo_discount > 0 ? (
        <CheckLine>
          <TextLabel>Промокод</TextLabel>
          <TextValue red>- {formatPrice(store.cart.promo_discount)}</TextValue>
        </CheckLine>
      ) : null}
      <CheckDash ellipsizeMode="clip" numberOfLines={1}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - -
      </CheckDash>
      <CheckLine>
        <TextLabel big>Итого</TextLabel>
        <TextValue big>{formatPrice(store.cart.sumProducts)}</TextValue>
      </CheckLine>
      <CheckLine>
        <TextLabel>Стоимость доставки</TextLabel>
        <TextValue>
          {store.cart.delivery_price === 0
            ? 'Бесплатно'
            : formatIntegerPrice(store.cart.delivery_price)}
          {/*{store.cart.deliveryStatus.free ? 'Бесплатно' : null}*/}
        </TextValue>
        {/*<TextValue green={store.cart.delivery_price === 0}>
                 {store.cart.delivery_price ? store.cart.delivery_price : "Бесплатно"}
                 </TextValue>*/}
      </CheckLine>
      <CheckDash ellipsizeMode="clip" numberOfLines={1}>
        - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        - - - - - - - - - - -
      </CheckDash>
    </Wrapper>
  );
};

export default observer(CartTotal);

const Wrapper = styled.View`
  flex: 1;
  margin-top: 20px;
  padding: 0 15px;
`;
const CheckLine = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 7px;
`;
const TextLabel = styled.Text`
  font-size: ${(props) => (props.big ? 17 : 12)}px;
  font-weight: ${(props) => (props.big ? 600 : '500')};
  color: ${(props) => (props.big ? '#000' : '#8E8E93')};
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
const DiscountView = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PercentView = styled.View`
  background: #8356ce;
  padding-horizontal: 6px;
  padding-vertical: 3px
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  margin-left: 10px;
`;
const TextPercent = styled.Text`
  color: #f6f6f6;
  font-size: 13px;
  font-weight: 500;
`;
const DiscountText = styled.Text`
  text-decoration-line: line-through;
  color: #8e8e93;
`;
