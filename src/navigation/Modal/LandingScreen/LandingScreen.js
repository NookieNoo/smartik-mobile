import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useStore } from '../../../store/Context';
import Swiper from 'react-native-swiper';
import styled from 'styled-components';

const SearchScreen = () => {
  const navigation = useNavigation();
  const store = useStore();
  const swiperRef = useRef();
  const { height, width } = useWindowDimensions();
  const [swiperIndex, setSwiperIndex] = useState(0);

  useEffect(() => {
    store.app.setAnalyticEvent('show_landing');
    store.app.setLanding();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (store.user.phone !== null) {
      navigation.replace('TabNavigation', {
        screen: 'Home',
        params: { screen: 'HomeScreen', params: { move: 'Promo' } },
      });
    }
  }, [store.user.phone]);

  const requestNotificationPermission = async () => {
    await messaging().requestPermission();
  };
  const showPromocodeScreen = () => {
    navigation.navigate('ModalNavigation', {
      screen: 'LoginPhoneScreen',
    });
  };

  const Skip = ({ color }) => (
    <SkipButton onPress={() => navigation.replace('TabNavigation')}>
      <SkipButtonText color={color}>Пропустить</SkipButtonText>
    </SkipButton>
  );

  return (
    <Swiper
      ref={swiperRef}
      onIndexChanged={setSwiperIndex}
      height={height}
      loop={false}
      activeDotColor={swiperIndex < 3 ? '#FDB650' : '#8256CE'}
    >
      <Wrapper bgColor={'#8256CE'}>
        <Content>
          <PaddingHorizontal>
            <Skip />
            <H1>
              Любимые продукты{'\n'}со <H1 color="#FCB650">скидками{'\n'}до 80%</H1>
            </H1>
            <Description>
              <ColorText color="#FCB650">Качественные </ColorText>
              продукты{'\n'}с <ColorText color="#FCB650">коротким остаточным сроком</ColorText>{' '}
              годности напрямую{'\n'}от производителей
            </Description>
            <Description>С доставкой{'\n'}на следующий день</Description>
          </PaddingHorizontal>
          <SaveButton onPress={() => swiperRef.current.scrollBy(1, true)}>
            <SaveButtonTitle>Хорошо</SaveButtonTitle>
          </SaveButton>
        </Content>
      </Wrapper>

      <Wrapper bgColor={'#EBE1D5'}>
        <Content>
          <LastPaddingHorizontal>
            <Skip color={'#000000'} />
          </LastPaddingHorizontal>
          <LastContent>
            <LastPageImageList
              source={require('../../../assets/png/modalBanner/WantBannerImage2.png')}
            />
            <LastPageImage
              source={require('../../../assets/png/modalBanner/WantBannerImage.png')}
            />
            <LastTextWrapper>
              <LastTextView>
                <Title>Скидка 200₽ на твой{'\n'}первый заказ 🔥</Title>
                <SubtitleView>
                  <Subtitle>
                    Промокод активирует скидку в 200₽ на первый заказ от 1200₽{' '}
                    <BoldSubtitle>«ХОЧУ200»</BoldSubtitle>
                  </Subtitle>
                  <BoldSubtitle>
                    Все свои промокоды, ты можешь найти в разделе «Бонусы и промокоды»
                  </BoldSubtitle>
                  <BoldSubtitle>Желаем приятных покупок 💜</BoldSubtitle>
                </SubtitleView>

                <LastButton onPress={() => showPromocodeScreen()} bgColor="#8256CE">
                  <SaveButtonTitle color="#FFFFFF">Посмотреть</SaveButtonTitle>
                </LastButton>
              </LastTextView>
            </LastTextWrapper>
          </LastContent>
        </Content>
      </Wrapper>
    </Swiper>
  );
};

export default observer(SearchScreen);

const Wrapper = styled(View)`
  flex: 1;
  background-color: ${(props) => props.bgColor};
`;
const Content = styled(View)`
  flex: 1;
  padding-top: 57px;
`;
const PaddingHorizontal = styled(View)`
  flex: 1;
  padding-horizontal: 20px;
`;
const SkipButton = styled(TouchableOpacity)``;
const SkipButtonText = styled(Text)`
  text-align: right;
  font-size: 16px;
  color: ${(props) => props.color ?? '#FFFFFF'};
`;
const H1 = styled(Text)`
  margin-top: 20px;
  font-size: 40px;
  line-height: 41px;
  font-weight: 700;
  color: ${(props) => props.color ?? '#FFFFFF'};
`;
const Description = styled(Text)`
  margin-top: 40px;
  font-size: 30px;
  line-height: 33px;
  font-weight: 700;
  color: ${(props) => props.color ?? '#FFFFFF'};
`;
const ColorText = styled(Text)`
  color: ${(props) => props.color};
`;
const SaveButtonTitle = styled(Text)`
  font-weight: 500;
  font-size: 17px;
  color: ${(props) => props.color ?? '#000'};
`;
const SaveButton = styled(TouchableOpacity)`
  margin-horizontal: 15px;
  bottom: 60px;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: ${(props) => props.bgColor ?? '#FDB650'};
  border-radius: 14px;
`;
const LastPageImageList = styled.Image`
  height: 70%;
  width: 50%;
  resize-mode: cover;
  position: absolute;
  top: 23px;
  left: 15px;
  z-index: 0;
`;
const LastPageImage = styled.Image`
  height: 80%;
  width: 75%;
  resize-mode: contain;
  position: absolute;
  top: 9px;
  right: -25px;
`;
const LastTextWrapper = styled.View`
  background-color: #ffffff;
  flex: 0.45;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;
const LastTextView = styled.View`
  margin: 20px 26.5px 0px;
  flex: 1;
`;
const LastContent = styled.View`
  justify-content: flex-end;
  flex: 1;
`;
const LastPaddingHorizontal = styled.View`
  padding-horizontal: 20px;
`;
const Title = styled.Text`
  color: #2c2c2b;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: 28.64px;
`;
const Subtitle = styled.Text`
  font-size: 15px;
  font-weight: 400;
  line-height: 17.9px;
  letter-spacing: -0.4px;
  color: #2c2c2b;
`;
const BoldSubtitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  line-height: 17.9px;
  letter-spacing: -0.4px;
  color: #2c2c2b;
`;
const SubtitleView = styled.View`
  margin-top: 4px;
  height: 45%;
  justify-content: space-evenly;
`;
const LastButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: ${(props) => props.bgColor ?? '#FDB650'};
  border-radius: 14px;
`;
