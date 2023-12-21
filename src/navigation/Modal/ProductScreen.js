import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import config from '../../config';
import Http from '../../initialize/Http';
import { useStore } from '../../store/Context';
import ProductItem from '../../store/items/ProductItem';
import dayjs from 'dayjs';
import debounce from 'lodash/debounce';
import { formatPrice, plural } from '../../config/helper';
import ArrowDownIcon from '../../assets/svg/icon/ArrowDownIcon';
import ArrowUpIcon from '../../assets/svg/icon/ArrowUpIcon';
import ProductRecommendation from './component/ProductRecommendation';
import ProductDiscounts from './component/ProductDiscounts';
import ProductMilkCategory from './component/ProductMilkCategory';
import ProductSausageCategory from './component/ProductSausageCategory';
import CloseIcon from '../../assets/svg/icon/CloseIcon';
import { useNavigation } from '@react-navigation/native';
import ArrowLeftIcon from '../../assets/svg/icon/ArrowLeftIcon';
import ProductPlusIcon from '../../assets/svg/icon/ProductPlusIcon';
import ProductMinusIcon from '../../assets/svg/icon/ProductMinusIcon';

const ProductScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();
  const [product, setProduct] = useState();
  const [count, setCount] = useState(0);

  const [isCollapsed, setIsCollapsed] = useState(true);
  const anim = useRef(new Animated.Value(0)).current;
  const animHeigth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [54, 1000],
  });

  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const opacityValue = opacityAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const onCollapse = () => {
    if (isCollapsed) {
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
    } else {
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
    }
  };

  useEffect(() => {
    const uuid = route.params?.uuid;
    if (uuid) {
      const find = store.product.items.find((item) => item.uuid === uuid);
      if (find) {
        setProduct(find);
      }
      load(uuid);
    }
    const cart = store.cart.products.find((item) => item.uuid === uuid);
    if (cart) {
      setCount(cart.count);
    }
  }, [route]);

  const load = async (uuid) => {
    store.product.setProductLoading(true);
    const result = await Http.get('/product/' + uuid);
    store.product.setProductLoading(false);
    if (result.success) {
      setProduct(ProductItem.create(result.data));
    }
  };

  const changeCount = (c) => {
    setCount((count) => count + c);
    debounceChangeCount(count + c, product.firstPrice.uuid);
  };

  const debounceChangeCount = useCallback(
    debounce(async (count, uuid) => {
      await store.cart.changeCount(uuid, count);
      setCount(count);
    }, 1500),
    []
  );

  const disablePlus = store.cart.isDisabledButton({
    type: 'plus',
    uuid: product?.firstPrice.uuid,
    limit: product?.firstPrice.count,
    count: count,
  });

  const disableMinus = store.cart.isDisabledButton({
    type: 'minus',
    uuid: product?.firstPrice.uuid,
    limit: product?.firstPrice.count,
    count: count,
  });

  const calculateLeftDays = () => {
    const day1 = new Date(product.firstPrice.expired_at);
    const day2 = new Date();

    const dayDiff = Math.ceil((day1.getTime() - day2.getTime()) / (1000 * 3600 * 24));

    return dayDiff;
  };

  if (!product) return null;

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: '#fff',
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      />
      <Wrapper>
        <ProductMilkCategory
          headerComp={
            <>
              <MainContentView>
                <View>
                  <Header>
                    <BackButton onPress={() => navigation.goBack()}>
                      <ArrowLeftIcon />
                    </BackButton>
                    <CloseButton onPress={() => navigation.popToTop()}>
                      <CloseIcon color="#fff" />
                    </CloseButton>
                  </Header>
                  <Image
                    resizeMode={'contain'}
                    source={{ uri: config.imageUrl + '/media/product/' + product.uuid + '/big' }}
                  />
                  <DiscountTimeView>
                    <Discount>
                      <DiscountValue>-{product.firstPrice.discount_percent}%</DiscountValue>
                    </Discount>
                    {calculateLeftDays() < 365 ? (
                      <TimeLeftView>
                        <TimeLeftText>
                          Осталось {plural(calculateLeftDays(), ['день', 'дня', 'дней'])}
                        </TimeLeftText>
                      </TimeLeftView>
                    ) : null}
                  </DiscountTimeView>

                  <Expire>
                    <ExpireDate>
                      Годен до {dayjs(product.firstPrice.expired_at).format('D MMMM')}
                    </ExpireDate>
                  </Expire>
                </View>

                {product.prices.length !== 0 ? (
                  <PriceWrapper>
                    <Price>{product.firstPrice.price}</Price>
                    {product.prices[0].discount ? (
                      <FullPrice>{product.firstPrice.full}</FullPrice>
                    ) : null}
                  </PriceWrapper>
                ) : null}

                <Title>{product.name}</Title>

                {product.description ? (
                  <DescriptionWrapper>
                    <Description>{product.description}</Description>
                  </DescriptionWrapper>
                ) : null}

                <Animated.View
                  style={{
                    width: '100%',
                    maxHeight: animHeigth,
                    backgroundColor: '#EEEEEE',
                    alignSelf: 'center',
                    borderRadius: 8,
                    marginTop: 20,
                  }}
                >
                  <CurrentStatusPress onPress={onCollapse}>
                    <CurrentTitle>Подробнее о товаре</CurrentTitle>

                    <CurrentIconView>
                      {isCollapsed ? <ArrowDownIcon /> : <ArrowUpIcon />}
                    </CurrentIconView>
                  </CurrentStatusPress>

                  <Animated.View
                    style={{
                      opacity: opacityValue,
                    }}
                  >
                    <AnimatedViewStyle>
                      {product.compound ? (
                        <CompoundWrapper>
                          <TextLabel>{product.compound}</TextLabel>
                        </CompoundWrapper>
                      ) : null}
                      {product.energy ? (
                        <EnergyWrapper>
                          <Energy>
                            <EnergyBox>
                              <EnergyLabel>Ккал</EnergyLabel>
                              <EnergyValue>{product.energy.calories}</EnergyValue>
                            </EnergyBox>
                            <EnergyBox>
                              <EnergyLabel>Белки</EnergyLabel>
                              <EnergyValue>{product.energy.protein}</EnergyValue>
                            </EnergyBox>
                            <EnergyBox>
                              <EnergyLabel>Жиры</EnergyLabel>
                              <EnergyValue>{product.energy.fat}</EnergyValue>
                            </EnergyBox>
                            <EnergyBox>
                              <EnergyLabel>Углеводы</EnergyLabel>
                              <EnergyValue>{product.energy.carbon}</EnergyValue>
                            </EnergyBox>
                          </Energy>
                        </EnergyWrapper>
                      ) : null}
                    </AnimatedViewStyle>
                  </Animated.View>
                </Animated.View>
              </MainContentView>

              <ProductRecommendation />
              <ProductDiscounts />
            </>
          }
          footerComp={<ProductSausageCategory />}
        />

        <CartWrapper>
          <BottomPriceView>
            <BottomPrice>
              {count ? formatPrice(product.numberPrice.newPrice * count) : product.firstPrice.price}
            </BottomPrice>
            <BottomOldPrice>
              {count ? formatPrice(product.numberPrice.oldPrice * count) : product.firstPrice.full}
            </BottomOldPrice>
          </BottomPriceView>
          {count ? (
            <CountChangeWrapper>
              <ActionButton
                onPress={() => changeCount(-1)}
                disabled={disableMinus}
                opacity={disableMinus}
              >
                <ProductMinusIcon color={disableMinus ? 'transparent' : '#fff'} />
              </ActionButton>
              <CountWrapper>
                {store.cart.count.loading ? (
                  <ActivityIndicator color={'#000'} />
                ) : (
                  <Count>{count}</Count>
                )}
              </CountWrapper>
              <ActionButton
                onPress={() => changeCount(1)}
                disabled={disablePlus}
                opacity={disablePlus}
              >
                <ProductPlusIcon color={disablePlus ? 'transparent' : '#fff'} />
              </ActionButton>
            </CountChangeWrapper>
          ) : (
            <AddButton
              onPress={async () => {
                await store.cart.changeCount(product.firstPrice.uuid, 1);
                const find = store.cart.products.find((item) => item.uuid === product.uuid);
                if (!find) return setCount(0);
                setCount(find.count);
              }}
              disabled={store.cart.count.loading}
            >
              {store.cart.count.loading ? (
                <ActivityIndicator color={'#fff'} />
              ) : (
                <AddButtonText>В корзину</AddButtonText>
              )}
            </AddButton>
          )}
        </CartWrapper>
      </Wrapper>
    </>
  );
};

export default observer(ProductScreen);

const Wrapper = styled.View`
  flex: 1;
  background-color: #f7f7f7;
`;
const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  z-index: 1;
  width: ${Dimensions.get('screen').width - 28}px;
`;
const Image = styled.Image`
  margin-top: 23px;
  width: 100%;
  height: 246px;
`;
const Discount = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 5px;
  background-color: #fc5230;
  align-self: flex-start;
`;
const DiscountValue = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
`;
const Expire = styled.View`
  bottom: 0px;
  padding-vertical: 2px;
  padding-horizontal: 5px;
  border-radius: 5px;
  background-color: #bee224;
  align-self: flex-start;
  margin-top: 8px;
`;
const ExpireDate = styled.Text`
  color: #333333;
  font-size: 16px;
  font-weight: 500;
`;
const Title = styled.Text`
  margin-top: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #353535;
  letter-spacing: -0.4px;
  line-height: 24px;
`;
const PriceWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 20px;
`;
const Price = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #fc5230;
`;
const FullPrice = styled.Text`
  margin-left: 8px;
  font-size: 16px;
  text-decoration: line-through;
  font-weight: 400;
  color: #9d9b98;
  margin-top: 2px;
  letter-spacing: -0.4px;
`;
const DescriptionWrapper = styled.View`
  margin-top: 15px;
`;
const Description = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: #353535;
  letter-spacing: -0.4px;
`;

const CompoundWrapper = styled.View``;
const EnergyWrapper = styled.View``;
const TextLabel = styled.Text`
  margin-top: 5px;
`;
const Energy = styled.View`
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
`;
const EnergyBox = styled.View`
  width: 23%;
  background: #e2e2e2;
  border-radius: 10px;
  padding: 5px 10px;
`;
const EnergyLabel = styled.Text`
  font-size: 12px;
  font-weight: 300;
`;
const EnergyValue = styled.Text`
  margin-top: 5px;
`;
const CartWrapper = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  shadow-color: rgba(0, 0, 0, 1);
  shadow-offset: 5px 5px;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
  height: 115px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  flex-direction: row;
  padding-vertical: 17px
  padding-horizontal: 14px;
  justify-content: space-between;
  align-items: flex-start
`;
const CountChangeWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
`;
const ActionButton = styled.TouchableOpacity`
  padding: 0 10px;
  background-color: #8356ce;
  width: 46px;
  height: 46px;
  border-radius: 9px;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.opacity ? '0.5' : '1.0')};
`;
const CountWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-horizontal: 27px;
`;
const Count = styled.Text`
  font-size: 22px;
  color: #8356ce;
  font-weight: 500;
`;
const AddButton = styled.TouchableOpacity`
  margin-left: 10px;
  align-items: center;
  justify-content: center;
  background-color: #8356ce;
  border-radius: 8px;
  height: 46px;
  width: 121px;
`;
const AddButtonText = styled.Text`
  font-weight: 500;
  color: #fff;
  font-size: 15px;
`;
const DiscountTimeView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;
const TimeLeftView = styled.View`
  background-color: #8356ce;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  border-radius: 5px;
  padding-vertical: 2px;
  padding-horizontal: 5px;
`;
const TimeLeftText = styled.Text`
  color: #f6f6f6;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
`;
const CurrentStatusPress = styled.Pressable`
  flex-direction: row;
  background-color: #eeeeee;
  border-radius: 8px;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-vertical: 17.5px;
`;
const CurrentTitle = styled.Text`
  font-weight: 500;
  font-size: 16px;
  color: #353535;
`;
const CurrentIconView = styled.View`
  justify-content: center;
`;
const AnimatedViewStyle = styled.View`
  padding-horizontal: 15px;
  padding-bottom: 17px;
`;
const MainContentView = styled.View`
  background-color: #ffffff;
  padding-horizontal: 15px;
  padding-bottom: 15px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;
const BottomPriceView = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
  margin-bottom: 17px;
`;
const BottomPrice = styled.Text`
  color: #8356ce;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.4px;
`;
const BottomOldPrice = styled.Text`
  margin-left: 8px;
  font-size: 16px;
  text-decoration: line-through;
  font-weight: 400;
  color: #9d9b98;
  margin-top: 2px;
  letter-spacing: -0.4px;
`;
const CloseButton = styled.TouchableOpacity`
  height: 34px;
  width: 34px;
  border-radius: 17px;
  background-color: #8356ce;
  align-items: center;
  justify-content: center;
`;
const BackButton = styled.TouchableOpacity`
  height: 34px;
  width: 34px;
  align-items: center;
  justify-content: center;
`;
