import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { formatPrice } from '../../../config/helper';
import { useStore } from '../../../store/Context';
import ArrowRightButtonIcon from '../../../assets/svg/icon/ArrowRightButtonIcon';

const CartPromo = ({}) => {
  const store = useStore();
  const navigation = useNavigation();

  return (
    <Wrapper>
      {store.cart.promos.length ? (
        <Promo>
          <Line>
            <TextLabel>Промокод</TextLabel>
            <TextValue>{store.cart.promos[0].name}</TextValue>
          </Line>
          {store.cart.promos[0].type === 'delivery' ? (
            <Line>
              <TextLabel>Скидка</TextLabel>
              <TextValue>Бесплатная доставка!</TextValue>
            </Line>
          ) : (
            <Line>
              <TextLabel>Скидка</TextLabel>
              <TextValue>
                {store.cart.promos[0].type === 'percent'
                  ? store.cart.promos[0].discount + '%'
                  : formatPrice(store.cart.promos[0].discount)}
              </TextValue>
            </Line>
          )}
          {store.cart.promos[0].from_sum ? (
            <Line>
              <TextLabel>Минимальная корзина</TextLabel>
              <TextValue>{formatPrice(store.cart.promos[0].from_sum)}</TextValue>
            </Line>
          ) : null}
          <ButtonCancel onPress={() => store.cart.removePromo()}>
            {store.cart.promo_loading ? (
              <ActivityIndicator />
            ) : (
              <CancelText>Отменить промокод</CancelText>
            )}
          </ButtonCancel>
        </Promo>
      ) : (
        <NewPromo
          onPress={() => {
            navigation.navigate('ModalNavigation', { screen: 'PromocodeScreen' });
          }}
        >
          <PromoText>У меня есть промокод!</PromoText>
          <ArrowRightButtonIcon />
        </NewPromo>
      )}
    </Wrapper>
  );
};

export default observer(CartPromo);

const Wrapper = styled.View`
  margin: 10px 15px 0;
  background: #eee;
  padding: 15px 10px 15px 15px;
  border-radius: 10px;
  border: 0 solid #ccc;
  border-bottom-width: 1px;
`;
const NewPromo = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Promo = styled.View``;
const Line = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0 5px;
`;
const PromoText = styled.Text`
  font-size: 15px;
  font-weight: 400;
  color: #000000;
  line-height: 17.9px;
`;
const TextLabel = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #333;
`;
const TextValue = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;
const CancelText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
`;

const ButtonCancel = styled.TouchableOpacity`
  margin-top: 10px;
  background: #e35656;
  padding: 10px 15px;
  border-radius: 10px;
  align-items: center;
`;
