import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import StoriesArrowLeftIcon from '../../assets/svg/icon/StoriesArrowLeft';
import StoriesArrowRightIcon from '../../assets/svg/icon/StoriesArrowRight';

const FirstPage = ({ next }) => {
  return (
    <Wrapper>
      <PromoImage source={require('../../assets/png/referralStory/1.png')} resizeMode="contain" />
      <TextView>
        <Title>Промокоды {`\n`}для друзей</Title>
        <Subtitle>
          Приглашай друзей в Покупкин и{' '}
          <YellowSubtitle>
            получай скидки. По 300₽ за каждого, кто сделает заказ по твоему промокоду.
          </YellowSubtitle>{' '}
          Раздавай промокод без ограничений и экономь на продуктах. {`\n\n`}Когда друг сделает
          первый заказ, вы сразу получите <YellowSubtitle>скидку 300₽</YellowSubtitle> на свой
          следующий заказ. И так за каждого друга.
        </Subtitle>
        <SmallSubtitle>
          Акция действует с 01.06.2023 до момента, пока не будет прекращена.
        </SmallSubtitle>
      </TextView>
      <PageButtonView>
        <PageView>
          <PageText>1 / 3</PageText>
        </PageView>

        <PageButtons>
          <StoriesArrowLeftIcon color="rgba(252, 182, 80, 0.2)" />

          <ButtonPage onPress={() => next()}>
            <StoriesArrowRightIcon color="#FCB650" />
          </ButtonPage>
        </PageButtons>
      </PageButtonView>
    </Wrapper>
  );
};

export default observer(FirstPage);

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
  justify-content: space-between;
  margin-bottom: 10px;
`;
const Title = styled.Text`
  font-size: 33px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15px;
`;
const Subtitle = styled.Text`
  font-size: 17px;
  font-weight: 400;
  color: #ffffff;
`;
const YellowSubtitle = styled.Text`
  font-size: 17px;
  font-weight: 700;
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
