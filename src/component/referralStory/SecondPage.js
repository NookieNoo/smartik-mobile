import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import StoriesArrowLeftIcon from '../../assets/svg/icon/StoriesArrowLeft';
import StoriesArrowRightIcon from '../../assets/svg/icon/StoriesArrowRight';

const SecondPage = ({ next, back }) => {
  return (
    <Wrapper>
      <PromoImage source={require('../../assets/png/referralStory/2.png')} resizeMode="contain" />
      <TextView>
        <Title>Как получить {`\n`}скидки</Title>

        <SubtitleView>
          <SubtitleNumber>1.</SubtitleNumber>
          <Subtitle>
            Отправь другу свой промокод из приложения, и он получит{' '}
            <YellowSubtitle>скидку 300₽</YellowSubtitle> {`\n`}на свой первый заказ.
          </Subtitle>
        </SubtitleView>

        <SubtitleView>
          <SubtitleNumber>2.</SubtitleNumber>
          <Subtitle>
            Когда друг сделает свой первый заказ и ему доставят продукты,{' '}
            <YellowSubtitle>скидка в 300₽ появится у тебя</YellowSubtitle> в разделе «Мои
            Промокоды».
          </Subtitle>
        </SubtitleView>

        <SubtitleView>
          <SubtitleNumber>3.</SubtitleNumber>
          <Subtitle>
            Найти свой промокод для друзей можно в «Бонусах и промокодах» раздел{' '}
            <YellowSubtitle>«Поделиться»</YellowSubtitle>.
          </Subtitle>
        </SubtitleView>

        <SmallSubtitle>
          Акция действует с 01.06.2023 до момента, пока не будет прекращена.
        </SmallSubtitle>
      </TextView>
      <PageButtonView>
        <PageView>
          <PageText>2 / 3</PageText>
        </PageView>
        <PageButtons>
          <ButtonPage onPress={() => back()}>
            <StoriesArrowLeftIcon color="#FCB650" />
          </ButtonPage>

          <ButtonPage onPress={() => next()}>
            <StoriesArrowRightIcon color="#FCB650" />
          </ButtonPage>
        </PageButtons>
      </PageButtonView>
    </Wrapper>
  );
};

export default observer(SecondPage);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #8356ce;
  justify-content: space-between;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding-vertical: 25px;
`;
const PromoImage = styled.Image`
  width: 100%;
  height: 35%;
`;
const TextView = styled.View`
  margin-horizontal: 25px;
`;
const Title = styled.Text`
  font-size: 33px;
  font-weight: 700;
  color: #ffffff;
  line-height: 28px;
`;
const Subtitle = styled.Text`
  font-size: 17px;
  font-weight: 400;
  margin-top: 10px;
  color: #ffffff;
`;
const SubtitleNumber = styled.Text`
  font-size: 17px;
  font-weight: 400;
  margin-top: 10px;
  color: #ffffff;
  margin-right: 5px;
`;
const YellowSubtitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
  margin-top: 10px;
  color: #fcb650;
`;
const SmallSubtitle = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  margin-top: 14px;
`;
const PageView = styled.View`
  border-radius: 6px;
  background-color: #fcb650;
  align-self: flex-start;
`;
const PageText = styled.Text`
  padding-horizontal: 8px;
  padding-vertical: 6px;
`;
const SubtitleView = styled.View`
  flex-direction: row;
`;

const PageButtonView = styled.View`
  flex-direction: row;
  margin-horizontal: 25px;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const PageButtons = styled.View`
  flex-direction: row;
`;
const ButtonPage = styled.TouchableOpacity`
  margin-left: 30px;
`;
