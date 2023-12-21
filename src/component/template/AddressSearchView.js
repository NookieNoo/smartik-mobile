import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../store/Context';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import AddressLocationIcon from '../../assets/svg/icon/AddressLocationIcon';
import SearchIcon from '../../assets/svg/icon/SearchIcon';

const AddressSearchView = () => {
  const navigation = useNavigation();
  const store = useStore();

  return (
    <Wrapper>
      <AddressWrapper
        onPress={() => {
          navigation.navigate('ModalNavigation', { screen: 'AddressLocationScreen' });
        }}
      >
        <AddressLocationIcon />
        <AddressTextView>
          <AddressTitle>Адрес доставки</AddressTitle>
          <AddressText numberOfLines={1}>
            {store.user.addresses.length
              ? store.user.addresses[store.user.addresses.length - 1].name
              : 'Нажмите, чтобы выбрать'}
          </AddressText>
        </AddressTextView>
      </AddressWrapper>

      <SearchWrapper>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderRadius: 8,
              backgroundColor: '#E7E7E7',
            }}
          >
            <SearchIcon />
            <Text style={{ marginLeft: 15, fontSize: 14, color: '#8E8E93', lineHeight: 17 }}>
              Поиск продуктов
            </Text>
          </View>
        </TouchableOpacity>
      </SearchWrapper>
    </Wrapper>
  );
};

export default observer(AddressSearchView);

const Wrapper = styled.View`
  width: 92%;
  align-self: center;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 4px;
`;
const AddressWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 30%;
`;
const AddressTextView = styled.View`
  margin-left: 6px;
`;
const AddressTitle = styled.Text`
  font-size: 10px;
  color: #8e8e92;
  font-weight: 400;
`;
const AddressText = styled.Text`
  color: #000000;
  font-weight: 400;
  font-size: 11px;
`;
const SearchWrapper = styled.View`
  width: 65%;
`;
