import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styled from 'styled-components/native';
import { Image, View, Text } from 'react-native';
import { useStore } from '../../../store/Context';

const HomePromo = () => {
  const brands = [
    {
      title: 'Доставим бесплатно',
      titleColor: '#000000',
      subTitle: 'Промокод на бесплатную доставку',
      description:
        'Бесплатная доставка — это всегда приятно! Дарим вам промокод на бесплатную доставку.\n\n' +
        'Как воспользоваться - введите промокод при оформлении заказа «ME655»\n\n' +
        'Воспользуйтесь уже сейчас и получите любимые товары по выгодной цене с бесплатной доставкой уже на следующий день!\n\n' +
        'Срок действия предложения до 31.12.2023 Промокод активирует одну бесплатную доставку при минимальном заказе от 500₽',
      background: '#D2C4B2',
      image: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/free-delivery.png'),
        style: { position: 'absolute', bottom: 0, right: 0, width: '50%' },
      },
      thumb: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/free-delivery.png'),
        style: { position: 'absolute', width: '100%', height: 50, bottom: 5 },
      },
      promoCode: 'ME655',
    },
    {
      title: 'Как получить скидку на заказ',
      titleColor: '#000000',
      subTitle: 'Как получить скидку на заказ',
      description:
        'По многочисленным просьбам сделали раздел с самыми глубокими скидками на товары, назвали его «Успей купить».\n\n' +
        'Теперь не нужно листать каталог, все самые лучшие предложения в одном разделе. Заходи и выбери товар с самой большой скидкой!',
      background: '#FCB650',
      image: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/discount-promo.png'),
        style: { position: 'absolute', bottom: -20, right: 0, width: '50%' },
      },
      thumb: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/discount-promo.png'),
        style: {
          position: 'absolute',
          width: '100%',
          height: 60,
          bottom: 0,
          right: -10,
        },
      },
    },
    {
      title: 'Самые выгодные предложения',
      titleColor: '#FFFFFF',
      subTitle: 'Самые выгодные предложения',
      description:
        'По многочисленным просьбам сделали раздел с самыми глубокими скидками на товары, назвали его «Успей купить».\n\n' +
        'Теперь не нужно листать каталог, все самые лучшие предложения в одном разделе. Заходи и выбери товар с самой большой скидкой!',
      background: '#8356CE',
      image: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/promo-offers.png'),
        style: { position: 'absolute', bottom: -20, right: 0, width: '50%' },
      },
      thumb: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/promo-offers.png'),
        style: { position: 'absolute', width: '100%', height: 50, bottom: -5, right: -20 },
      },
    },
    {
      title: 'Доставим на следующий день!',
      titleColor: '#000000',
      subTitle: 'Доставка на следующий день!',
      description:
        'Теперь при заказе до 00:00 мы доставим ваш заказ уже на следующий день!\n\n' +
        'Продукты по суперцене стали ближе, выбирай товары из любого раздела в каталоге и получи их с доставкой на следующий день.\n' +
        'Курьер обязательно позвонит, а push-уведомление предупредит о том, когда курьер будет выезжать к вам на адрес.\n\n',
      background: '#FCB650',
      image: {
        source: require('../../../assets/png/promo/next-day-delivery.png'),
        style: { position: 'absolute', bottom: 0 },
      },
      thumb: {
        source: require('../../../assets/png/promo/next-day-delivery.png'),
        style: { position: 'absolute', width: '100%', height: 45, bottom: 0 },
      },
    },
    {
      title: 'Расширили\nзону доставки',
      titleColor: '#FFFFFF',
      subTitle: 'Расширили зону доставки',
      description:
        'Теперь Покупкин доставляет продукты не только по Москве, но и за ее пределами.\n\n' +
        'Чтобы посмотреть доступность адреса, просто нажмите на адрес вверху экрана и укажите свой адрес, интерактивная карта подскажет, осуществляем ли мы доставку в этом районе.\n\n' +
        'Если вашего адреса не оказалось на карте, позвоните или напишите нам, мы обязательно решим эту проблему!\n\n' +
        'Щербинка, Люберцы, Коммунарка, Марьино, Внуково, Одинцово, Барвиха, Красногорск, Митино, Химки, Долгопрудный, Мытищи, Румянцево и другие.',
      background: '#8356CE',
      image: {
        source: require('../../../assets/png/promo/expand-delivery-area.png'),
        style: { position: 'absolute', bottom: -1, right: 0, width: '90%' },
      },
      thumb: {
        resizeMode: 'contain',
        source: require('../../../assets/png/promo/expand-delivery-area.png'),
        style: { position: 'absolute', width: '100%', height: 45, bottom: -4 },
      },
    },
  ];

  const navigation = useNavigation();
  const store = useStore();

  return (
    <Wrapper>
      <ScrollWrapper horizontal={true} showsHorizontalScrollIndicator={false}>
        {brands.map((item, index) => (
          <ItemWrapper
            onPress={() => {
              store.story.setStory(index);
              navigation.navigate('ModalNavigation', {
                screen: 'PromoScreen',
              });
            }}
            key={index}
            first={index}
          >
            <ItemCard bgColor={item.background}>
              <Image {...item.thumb} />
              <ItemTitle color={item.titleColor}>{item.title}</ItemTitle>
            </ItemCard>
          </ItemWrapper>
        ))}
        <SeparatorView />
      </ScrollWrapper>
    </Wrapper>
  );
};

export default observer(HomePromo);

const Wrapper = styled.View`
  margin-top: 10px;
`;
const Header = styled.Text`
  //padding-left: 15px;
  font-weight: 600;
  font-size: 18px;
  margin-left: 14px;
`;
const ScrollWrapper = styled.ScrollView`
  margin-top: 15px;
  max-height: 120px;
  padding-left: 14px;
`;
const ItemWrapper = styled.TouchableOpacity`
  //margin-left: ${(props) => (!props.first ? 0 : 0)}px;
  margin-right: 8px;
  max-width: 100px;
  align-items: flex-end;
`;
const ItemCard = styled.View`
  position: relative;
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${(props) => props.bgColor};
`;
const ItemTitle = styled.Text`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  padding: 5px;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: -0.4px;
  color: ${(props) => props.color};
`;
const SeparatorView = styled.View`
  padding-right: 20px;
`;
