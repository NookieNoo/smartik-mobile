import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import config from '../../../config';
import dayjs from 'dayjs';
import { formatPrice } from '../../../config/helper';

const OrderCard = ({ product }) => {
  if (!product) return null;

  return (
    <Wrapper deleted={product.is_deleted}>
      <ImageWrapper>
        <Image
          resizeMode={'contain'}
          source={{ uri: config.imageUrl + '/media/product/' + product.uuid + '/big' }}
        />
      </ImageWrapper>
      <ProductWrapper>
        <Title deleted={product.is_deleted} numberOfLines={2}>
          {product.name}
          {product.is_deleted}
        </Title>
        <DiscountExpireView>
          <Discount>
            <DiscountValue>-{product.discount_percent}%</DiscountValue>
          </Discount>
          <Expire>
            <ExpireDate>Годен до {dayjs(product.expired_at).format('D MMM')}</ExpireDate>
          </Expire>
        </DiscountExpireView>
        <Count>Заказано {product.count} шт</Count>
      </ProductWrapper>
      <InfoWrapper>
        {!product.is_deleted ? (
          <PriceWrapper>
            <DiscountPrice>
              {formatPrice((product.price + product.discount) * product.count)}
            </DiscountPrice>
            <PriceCount>
              <Price>{formatPrice(product.price * product.count)}</Price>
            </PriceCount>
          </PriceWrapper>
        ) : (
          <Over>
            <OverText>Закончилось</OverText>
          </Over>
        )}
      </InfoWrapper>
    </Wrapper>
  );
};

export default observer(OrderCard);

const Wrapper = styled.View`
  flex-direction: row;
  opacity: ${(props) => (props.deleted ? 0.5 : 1)};
  border-bottom-width: 1px;
  border-color: #e3e3e3;
  padding-bottom: 12px;
  margin-top: 12px;
`;
const Image = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;
const PriceCount = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;
const Count = styled.Text`
  color: #8e8e93;
  font-size: 10px;
  font-weight: 400;
  margin-top: 8px;
`;
const Price = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #eb4d3d;
  margin-top: 6px;
`;
const DiscountPrice = styled.Text`
  text-decoration-line: line-through;
  color: #9d9b98;
  font-size: 12px;
`;
const ImageWrapper = styled.View`
  justify-content: center;
`;
const ProductWrapper = styled.View`
  flex: 1;
  padding-left: 10px;
`;
const Title = styled.Text`
  font-size: 12px;
  text-decoration: ${(props) => (props.deleted ? 'line-through' : 'none')};
  font-weight: 500;
  line-height: 14.32px;
  color: #000000;
`;
const InfoWrapper = styled.View``;
const PriceWrapper = styled.View`
  align-items: flex-end;
`;
const Discount = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 6px;
  border-radius: 3px;
  background-color: #fc5230;
  align-self: flex-start;
`;
const DiscountValue = styled.Text`
  color: #f6f6f6;
  font-size: 10px;
  font-weight: 500;
`;
const Expire = styled.View`
  padding-vertical: 3px;
  padding-horizontal: 6px;
  border-radius: 3px;
  background-color: #bee224;
  margin-left: 8px;
`;
const ExpireDate = styled.Text`
  color: #333333;
  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
`;
const Over = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 5px;
  background-color: #e20711;
`;
const OverText = styled.Text`
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
`;
const DiscountExpireView = styled.View`
  flex-direction: row;
  margin-top: 6px;
`;
