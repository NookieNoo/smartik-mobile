import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import Trash from '../../assets/svg/icon/Trash';
import store from '../../store/Store';

const visaPng = require('../../assets/png/cards/Visa.png');
const mastercardPng = require('../../assets/png/cards/Mastercard.png');
const mirPng = require('../../assets/png/cards/Mir.png');

const ProfileCardsScreen = () => {
  useEffect(() => {
    store.paymentCards.loadCards();
  }, []);

  const deleteCard = (cardId) => {
    Alert.alert('Удалить способ оплаты', 'Вы действительно ходите удалить эту карту?', [
      {
        text: 'Удалить',
        onPress: async () => store.paymentCards.removeCardById(cardId),
      },
      { text: 'Оставить' },
    ]);
  };

  const renderItem = (card, index) => {
    return (
      <CardWrapper>
        <CardItem>
          <CardInfo>
            {index === 0 && <CardImage source={visaPng} />}
            {index === 1 && <CardImage source={mastercardPng} />}
            {index === 2 && <CardImage source={mirPng} />}
            <CardNumber main={card.isMain}>{card.Pan}</CardNumber>
            <MainButtonText main={card.isMain}>
              {card.isMain ? 'Основная' : 'Сделать основной'}
            </MainButtonText>
          </CardInfo>
          <TouchableOpacity onPress={() => deleteCard(card.CardId)}>
            <Trash color="#C7C7CC" width="15" height="13.5" />
          </TouchableOpacity>
        </CardItem>
      </CardWrapper>
    );
  };

  return (
    <Wrapper>
      <FlatList
        data={store.paymentCards.items}
        renderItem={({ item, index }) => renderItem(item, index)}
      />
    </Wrapper>
  );
};

export default observer(ProfileCardsScreen);

const Wrapper = styled(View)`
  flex: 1;
  background: #f6f6f6;
`;
const CardWrapper = styled.View`
  border-bottom-width: 1px;
  border-color: #e3e3e3;
  background: #ffffff;
`;
const CardItem = styled.View`
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-horizontal: 15px;
`;
const CardImage = styled.Image`
  height: 24px;
  width: 24px;
`;
const CardInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;
const CardNumber = styled.Text`
  font-size: ${(props) => (props.main ? '14px' : '12px')};
  font-weight: ${(props) => (props.main ? '500' : '400')};
  color: #000000;
  margin-horizontal: 16px;
`;
const MainButtonText = styled.Text`
  font-size: ${(props) => (props.main ? '12px' : '10px')};
  font-weight: 400;
  color: #8e8e92;
`;
