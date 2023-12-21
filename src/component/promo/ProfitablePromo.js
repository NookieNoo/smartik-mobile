import { observer } from 'mobx-react-lite';
import React from 'react';
import { View, Dimensions } from 'react-native';
import styled from 'styled-components/native';

const ProfitablePromo = ({ press }) => {
  return (
    <Wrapper>
      <WrapperContent>
        <PromoImage
          source={require('../../assets/png/promoStories/profitable-promo.png')}
          resizeMode="contain"
        />
        <TextView>
          <Title>Самые выгодные предложения</Title>
          <Subtitle>
            По многочисленным просьбам сделали раздел с самыми глубокими скидками на товары, назвали
            его
            <PromoText> «Успей купить»</PromoText>.{`\n\n`}
            Теперь не нужно листать каталог, все самые лучшие предложения в одном разделе.{`\n`}
          </Subtitle>
          <BoldSubtitle>Заходи и выбери товар с самой большой скидкой!</BoldSubtitle>
          <Button onPress={() => press()}>
            <ButtonText>Посмотреть</ButtonText>
          </Button>
        </TextView>
      </WrapperContent>
    </Wrapper>
  );
};

export default observer(ProfitablePromo);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #8356ce;
  justify-content: center;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;
const WrapperContent = styled(View)`
  flex: 1;
  justify-content: space-between;
  margin-vertical: 45px;
`;
const PromoImage = styled.Image`
  width: ${Dimensions.get('screen').width - 50}px;
  height: 40%;
  align-self: center;
`;
const TextView = styled.View`
  margin-horizontal: 25px;
  justify-content: space-evenly;
`;
const Title = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  line-height: 28px;
  align-self: flex-start;
`;
const Subtitle = styled.Text`
  font-size: 14px;
  font-weight: 400;
  margin-top: 10px;
  color: #ffffff;
`;
const BoldSubtitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
`;
const PromoText = styled.Text`
  font-weight: 700;
  font-size: 12px;
`;
const Button = styled.TouchableOpacity`
  background-color: #fcb650;
  border-radius: 8px;
  align-self: flex-start;
  margin-top: 20px;
`;
const ButtonText = styled.Text`
  padding-horizontal: 30px;
  padding-vertical: 19px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
`;
const NonImageView = styled.View``;
