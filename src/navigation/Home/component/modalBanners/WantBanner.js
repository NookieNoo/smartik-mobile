import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';
import CloseIcon from '../../../../assets/svg/icon/CloseIcon';

const WantBanner = ({ copyCode, close }) => {
  return (
    <Wrapper>
      <CloseButton onPress={close}>
        <CloseIcon color="#FFFFFF" />
      </CloseButton>
      <ListImage source={require('../../../../assets/png/modalBanner/WantBannerImage2.png')} />
      <ImageWrapper source={require('../../../../assets/png/modalBanner/WantBannerImage.png')} />
      <TextWrapper>
        <TextView>
          <Title>Скидка 200₽ на твой{'\n'}первый заказ у нас 🔥</Title>
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

          <Button onPress={() => copyCode('ХОЧУ200')}>
            <ButtonText>Посмотреть</ButtonText>
          </Button>
        </TextView>
      </TextWrapper>
    </Wrapper>
  );
};

export default observer(WantBanner);

const Wrapper = styled.View`
  background-color: #ebe1d5;
  flex: 0.7;
  border-radius: 20px;
  justify-content: flex-end;
  z-index: 1;
`;
const TextWrapper = styled.View`
    flex: 0.52
    background-color: #FFFFFF
    border-radius: 20px;
`;
const TextView = styled.View`
  margin: 20px 22.5px;
  flex: 1;
`;
const ImageWrapper = styled.Image`
  height: 70%;
  width: 60%;
  resize-mode: contain;
  position: absolute;
  top: 9px;
  right: -15px;
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
const Button = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  border-radius: 8px;
  background-color: #8356ce;
  align-items: center;
  justify-content: center;
  bottom: 0px;
  position: absolute;
`;
const ButtonText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.4px;
  color: #ffffff;
`;
const SubtitleView = styled.View`
  margin-top: 4px;
  height: 48%;
  justify-content: space-between;
`;
const ListImage = styled.Image`
  height: 70%;
  width: 53%;
  resize-mode: cover;
  position: absolute;
  top: 0px;
  left: 30px;
  z-index: 0;
`;
const CloseButton = styled.TouchableOpacity`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background-color: #8356ce;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10;
  top: 11px;
  right: 11px;
`;
