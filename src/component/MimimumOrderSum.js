import { observer } from 'mobx-react-lite';
import styled from 'styled-components/native';
import { useStore } from '../store/Context';
import { useNavigation } from '@react-navigation/native';
import CartSmallIcon from '../assets/svg/icon/CartSmallIcon';
import CarIcon from '../assets/svg/icon/CarIcon';
import LightningIcon from '../assets/svg/icon/LightningIcon';
import { formatPrice } from '../config/helper';

const MinimumOrderSum = ({ bottom = 5 }) => {
  const store = useStore();
  const navigation = useNavigation();

  if (store.cart.products.length === 0) {
    return;
  }

  const renderBottomText = () => {
    if (store.cart.sumProducts < store.cart.delivery.possible) {
      return {
        icon: <LightningIcon />,
        text: `Минимальная сумма заказа ${formatPrice(store.cart.delivery.possible)}`,
      };
    }

    if (store.cart.delivery_price !== 0 && store.cart.sumProducts >= store.cart.delivery.possible) {
      return {
        icon: <CarIcon />,
        text: `Доставка ${
          store.cart.delivery.price
        }₽ · До бесплатной ещё ${store.cart.deliveryStatus.need.toFixed(0)}₽`,
      };
    }

    if (store.cart.delivery_price === 0 && store.cart.sumProducts >= store.cart.delivery.possible) {
      return {
        icon: <CartSmallIcon />,
        text: 'Оформи заказ до 00:00 с доставкой на завтра',
      };
    }
  };

  return (
    <Wrapper>
      <CartButton onPress={() => navigation.navigate('TabNavigation', { screen: 'Cart' })}>
        <CartButtonInfo>
          <PercentText>-{store.cart.getTotalPercent.toFixed(0)}%</PercentText>
          <PriceWrapper>
            <TotalPrice>
              {formatPrice(store.cart.sumProducts + store.cart.promo_discount)}
            </TotalPrice>
            <TotalOldPrice>{formatPrice(store.cart.sumProductsFull)}</TotalOldPrice>
          </PriceWrapper>

          <CartButtonText>Корзина</CartButtonText>
        </CartButtonInfo>
      </CartButton>
      <BottomTextView>
        {renderBottomText().icon}
        <BottomText>{renderBottomText().text}</BottomText>
      </BottomTextView>
    </Wrapper>
  );
};

export default observer(MinimumOrderSum);

const Wrapper = styled.TouchableOpacity`
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 15px 10px;
  shadow-color: rgba(0, 0, 0, 0.25);
  shadow-offset: 0px 5px;
  shadow-opacity: 0.5;
  shadow-radius: 20px;
  border-bottom-width: 0.3px;
  border-bottom-color: #bebebd;
`;
const CartButton = styled.TouchableOpacity`
  background-color: #8356ce;
  border-radius: 8px;
`;
const CartButtonText = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: #ffffff;
`;
const CartButtonInfo = styled.View`
  flex-direction: row;
  margin: 12px 10px;
  align-items: center;
  justify-content: space-between;
`;
const PercentText = styled.Text`
  color: #ffffff;
  font-size: 21px;
  letter-spacing: -0.45px;
  font-weight: 400;
`;
const TotalPrice = styled.Text`
  font-size: 21px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.45px;
`;
const TotalOldPrice = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  text-decoration-line: line-through;
  margin-left: 10px;
`;
const BottomTextView = styled.View`
  flex-direction: row;
  align-self: center;
  margin-top: 8px;
  align-items: center;
  height: 25px;
`;
const BottomText = styled.Text`
  margin-left: 13px;
  font-weight: 600;
  font-size: 12px;
  color: #353535;
  letter-spacing: -0.08px;
`;
const PriceWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
