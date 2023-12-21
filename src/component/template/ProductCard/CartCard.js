import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import styled from 'styled-components/native';
import config from '../../../config';
import { useStore } from '../../../store/Context';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { formatPrice } from '../../../config/helper';
import { useNavigation } from '@react-navigation/native';
import CancelIcon from '../../../assets/svg/icon/CancelIcon';
import ProductMinusIcon from '../../../assets/svg/icon/ProductMinusIcon';
import ProductPlusIcon from '../../../assets/svg/icon/ProductPlusIcon';

const CartCard = ({ product, index }) => {
  const navigation = useNavigation();
  const store = useStore();
  const [count, setCount] = useState(0);
  const [deleteProcess, setDeleteProcess] = useState(false);

  const changeCount = (c, debounce = true) => {
    setCount((count) => count + c);
    if (debounce) {
      debounceChangeCount(count + c + product.count, product.uuid_price);
    } else {
      unDebounceChangeCount(count + c + product.count, product.uuid_price);
    }
  };

  const deleteProduct = async () => {
    setDeleteProcess(true);
    await store.cart.changeCount(product.uuid_price, 0, false);
    setDeleteProcess(false);
  };

  const debounceChangeCount = useCallback(
    debounce(async (count, uuid) => {
      await store.cart.changeCount(uuid, count);
      setCount(0);
    }, 1500),
    []
  );

  const unDebounceChangeCount = async (count, uuid) => {
    await store.cart.changeCount(uuid, count);
    setCount(0);
  };

  const disablePlus = store.cart.isDisabledButton({
    type: 'plus',
    uuid: product.uuid_price,
    limit: product.limit,
    count: product.count,
  });

  const disableMinus = store.cart.isDisabledButton({
    type: 'minus',
    uuid: product.uuid_price,
    limit: product.limit,
    count: product.count,
  });

  if (!product) return null;

  return (
    <Wrapper delete={deleteProcess}>
      <Button onPress={() => navigation.navigate('ProductScreen', { uuid: product.uuid })}>
        <ImageWrapper deleted={product.is_deleted || product.availableCount === 0 || deleteProcess}>
          <Image
            resizeMode={'contain'}
            source={{ uri: config.imageUrl + '/media/product/' + product.uuid + '/big' }}
          />
        </ImageWrapper>
        <ProductWrapper>
          <HeaderWrapped>
            <Title
              deleted={product.is_deleted || product.availableCount === 0 || deleteProcess}
              numberOfLines={1}
            >
              {product.name}
            </Title>

            <DeleteButton onPress={() => deleteProduct()}>
              <CancelIcon color="#9D9B98" />
            </DeleteButton>
          </HeaderWrapped>
          <DiscountDateView>
            <Discount deleted={product.is_deleted || product.availableCount === 0 || deleteProcess}>
              <DiscountValue>-{product.discount_percent}%</DiscountValue>
            </Discount>
            <Expire deleted={product.is_deleted || product.availableCount === 0 || deleteProcess}>
              <ExpireDate>Годен до {dayjs(product.expired_at).format('D MMMM')}</ExpireDate>
            </Expire>
            {product.is_deleted && !product.available_count && (
              <Over>
                <OverText>Закончилось</OverText>
              </Over>
            )}
          </DiscountDateView>

          {!product.is_deleted && product.available_count ? (
            <InfoWrapper>
              <ActionWrapper>
                {product.available_count === product.count ? (
                  <>
                    <ActionButton
                      onPress={() => changeCount(-1)}
                      disabled={disableMinus || product.is_deleted}
                      opacity={disableMinus}
                    >
                      <ProductMinusIcon color={disableMinus ? '#ccc' : '#333'} widthSize="14" />
                    </ActionButton>
                    <ActionCountWrapper>
                      {store.cart.count.loading && store.cart.count.uuid === product.uuid_price ? (
                        <ActivityIndicator />
                      ) : (
                        <ActionCountText>{product.count + count}</ActionCountText>
                      )}
                    </ActionCountWrapper>
                    <ActionButton
                      onPress={() => changeCount(+1)}
                      disabled={disablePlus || product.is_deleted}
                      opacity={disablePlus}
                    >
                      <ProductPlusIcon color={disablePlus ? '#ccc' : '#333'} size="14" />
                    </ActionButton>
                  </>
                ) : (
                  <LeftPiecesButton
                    onPress={() =>
                      changeCount((product.count - product.available_count) * -1, false)
                    }
                  >
                    {store.cart.count.loading && store.cart.count.uuid === product.uuid_price ? (
                      <ActivityIndicator />
                    ) : (
                      <Text>Оставить {product.available_count}</Text>
                    )}
                  </LeftPiecesButton>
                )}
              </ActionWrapper>
              {/*<Text
									style={{fontSize: 10}}>Осталось {product.available_count + ' ' + product.count}</Text>*/}
              <PriceWrapper>
                <DiscountPrice>
                  {formatPrice((product.price + product.discount) * product.count)}
                </DiscountPrice>
                <Price>{formatPrice(product.price * product.count)}</Price>
              </PriceWrapper>
            </InfoWrapper>
          ) : (
            <>
              <DeleteBigButton onPress={() => deleteProduct()}>
                <Text>Удалить</Text>
              </DeleteBigButton>
            </>
          )}
        </ProductWrapper>
      </Button>
    </Wrapper>
  );
};

export default observer(CartCard);

const Wrapper = styled.View`
  flex: 1;
  margin-bottom: 10px;
  padding-horizontal: 14px;
`;
const Button = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  padding-bottom: 10px;
`;
const Image = styled.Image`
  width: 90px;
  height: 90px;
  border-radius: 10px;
`;
const Price = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #eb4d3d;
`;
const DiscountPrice = styled.Text`
  text-decoration-line: line-through;
  font-weight: 400;
  font-size: 12px;
  color: #9d9b98;
`;
const ImageWrapper = styled.View`
  justify-content: center;
  opacity: ${(props) => (props.deleted ? 0.2 : 1)};
`;
const ProductWrapper = styled.View`
  flex: 1;
  padding-left: 10px;
`;
const HeaderWrapped = styled.View`
  flex-direction: row;
`;
const Title = styled.Text`
  flex: 1;
  font-size: 14px;
  text-decoration: ${(props) => (props.deleted ? 'line-through' : 'none')};
  opacity: ${(props) => (props.deleted ? 0.2 : 1)};
  color: #353535;
  letter-spacing: -0.4px;
  font-weight: 400;
`;
const DeleteButton = styled.TouchableOpacity`
  padding-left: 10px;
`;
const InfoWrapper = styled.View`
  margin-top: 12px;
  flex-direction: row;
  align-items: flex-end;
`;
const ActionWrapper = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;
const ActionCountWrapper = styled.View`
  width: 40px;
  align-items: center;
`;
const ActionButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 36px;
  background-color: #eeeeee;
  opacity: ${(props) => (props.opacity ? '0.5' : '1.0')};
`;
const ActionCountText = styled.Text`
  font-size: 15px;
`;
const LeftPiecesButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  border-radius: 6px;
  height: 36px;
  background-color: #f6f6f6;
`;
const PriceWrapper = styled.View`
  align-items: flex-end;
`;
const Discount = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 3px;
  background-color: #fc5230;
  align-self: flex-start;
  opacity: ${(props) => (props.deleted ? 0.2 : 1)};
`;
const DiscountValue = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
`;
const Expire = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 3px;
  background-color: #bee224;
  margin-left: 4px;
  opacity: ${(props) => (props.deleted ? 0.2 : 1)};
`;
const ExpireDate = styled.Text`
  font-size: 11px;
  font-weight: 500;
  color: #353535;
`;
const Over = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 3px;
  background-color: #fc5230;
  margin-left: 4px;
`;
const OverText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.8px;
`;
const DeleteBigButton = styled.TouchableOpacity`
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  border-radius: 6px;
  height: 30px;
  background-color: #f6f6f6;
  top: 17px;
`;
const DiscountDateView = styled.View`
  flex-direction: row;
`;
