import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import debounce from 'lodash/debounce';
import Http from '../../initialize/Http';
import { prettyDaDataAddressSuggest } from '../../store/helper/StringMethod';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import { useNavigation } from '@react-navigation/native';
import SearchIcon from '../../assets/svg/icon/SearchIcon';
import CloseIcon from '../../assets/svg/icon/CloseIcon';

const AddressInputScreen = ({ route }) => {
  const navigation = useNavigation();
  const { address, setAddress, fitToCoordinate } = route.params;

  const inputRef = useRef();

  const [addressOptions, setAddressOptions] = useState([]);

  useEffect(() => {
    searchAddress(address?.title);
  }, []);

  const onSearch = (query) => {
    if (query?.trim()?.length > 2) {
      searchAddress(query);
    } else {
      setAddressOptions([]);
    }
  };

  const searchAddress = useCallback(
    debounce(async (query) => {
      if (query?.trim()?.length > 2) {
        const result = await Http.post(
          'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
          {
            count: 4,
            from_bound: { value: 'street' },
            to_bound: { value: 'house' },
            locations_geo: [
              {
                lat: 55.74585,
                lon: 37.621817,
                radius_meters: 45000,
              },
            ],
            query,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Token c78cc23dd291dca0ac4ff86a9b2ff43580234486',
            },
            external: true,
            noAuth: true,
          }
        );

        if (result.code === 200) {
          let tmp = [];
          let i = 0;
          result?.suggestions.map((_address) => {
            if (
              _address?.value?.trim()?.length &&
              _address.data?.geo_lat &&
              _address.data?.geo_lon
            ) {
              tmp.push(_address);
            }
          });
          setAddressOptions(tmp);
        }
      }
    }, 300),
    []
  );

  const selectAddress = (address) => {
    setAddress({
      title: prettyDaDataAddressSuggest(address.data),
      lat: address.data.geo_lat,
      lng: address.data.geo_lon,
    });

    fitToCoordinate(
      {
        latitude: address.data.geo_lat,
        longitude: address.data.geo_lon,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.005,
      },
      true
    );
    navigation.goBack();
  };

  return (
    <Wrapper>
      <InputWrapper>
        <AddressInput
          ref={inputRef}
          autoFocus
          placeholder="Введите адрес"
          placeholderTextColor="#8E8E93"
          onChangeText={onSearch}
          defaultValue={address?.title ?? ''}
        />
        <SearchIconView>
          <SearchIcon />
        </SearchIconView>
        <TouchableOpacity
          onPress={() => {
            inputRef.current.clear();
            onSearch('');
          }}
          style={{
            position: 'absolute',
            right: 10,
            padding: 15,
            width: 8,
            height: 8,
            borderRadius: 20,
            backgroundColor: '#8e8e93',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CloseIcon size="10" color="#fff" />
        </TouchableOpacity>
      </InputWrapper>

      <ResultWrapper>
        {addressOptions.map((_address, _index) => (
          <TouchableOpacity
            key={'adr-' + _index}
            onPress={() => selectAddress(_address)}
            style={{ paddingVertical: 15, borderBottomWidth: 1, borderColor: '#EFEFF4' }}
          >
            <Text style={{ fontSize: 17 }}>{prettyDaDataAddressSuggest(_address.data)}</Text>
            <Text style={{ marginTop: 2, color: '#8E8E93' }}>{_address.data.city}</Text>
          </TouchableOpacity>
        ))}
      </ResultWrapper>
    </Wrapper>
  );
};

export default observer(AddressInputScreen);

const Wrapper = styled(View)`
  flex: 1;
  padding-horizontal: 15px;
`;
const ResultWrapper = styled(View)`
  margin-top: 10px;
`;
const InputWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const AddressInput = styled(TextInput)`
  flex: 1;
  padding-vertical: 16px;
  padding-horizontal: 40px;
  border-radius: 14px;
  background-color: #f6f6f6;
  font-size: 17px;
`;
const SearchIconView = styled(View)`
  position: absolute;
  left: 15px;
`;
