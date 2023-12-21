import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import StoriesArrowLeftIcon from '../../assets/svg/icon/StoriesArrowLeft';
import StoriesArrowRightIcon from '../../assets/svg/icon/StoriesArrowRight';

const ThirdPage = ({ back, close }) => {
  return (
    <Wrapper>
      <PromoImage source={require('../../assets/png/referralStory/3.png')} resizeMode="contain" />
      <TextView>
        <Title>Кстати</Title>

        <SubtitleView>
          <SubtitleNumber>•</SubtitleNumber>
          <Subtitle>
            Другу нужно ввести ваш промокод во время оформления заказа в поле{' '}
            <YellowSubtitle>«У меня есть промокод!»</YellowSubtitle>.
          </Subtitle>
        </SubtitleView>

        <SubtitleView>
          <SubtitleNumber>•</SubtitleNumber>
          <Subtitle>Промокод не сработает, если у друга уже был совершен первый заказ.</Subtitle>
        </SubtitleView>

        <SmallSubtitle>
          Акция действует с 01.06.2023 до момента, пока не будет прекращена.
        </SmallSubtitle>

        <ConfirmButton onPress={close}>
          <ConfirmButtonText>Отлично</ConfirmButtonText>
        </ConfirmButton>
      </TextView>
      <PageButtonView>
        <PageView>
          <PageText>3 / 3</PageText>
        </PageView>
        <PageButtons>
          <ButtonPage onPress={() => back()}>
            <StoriesArrowLeftIcon color="#FCB650" />
          </ButtonPage>

          <StoriesArrowRightIcon color="rgba(252, 182, 80, 0.2)" />
        </PageButtons>
      </PageButtonView>
    </Wrapper>
  );
};

export default observer(ThirdPage);

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
  margin-top: 40px;
`;
const TextView = styled.View`
  margin-horizontal: 25px;
`;
const Title = styled.Text`
  font-size: 33px;
  font-weight: 700;
  color: #ffffff;
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
const ConfirmButton = styled.TouchableOpacity`
  background-color: #fcb650;
  align-self: flex-start;
  border-radius: 8px;
  margin-top: 24px;
`;
const ConfirmButtonText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: #2c2c2b;
  padding-horizontal: 30px;
  padding-vertical: 15px;
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
  margin-right: 30px;
`;
