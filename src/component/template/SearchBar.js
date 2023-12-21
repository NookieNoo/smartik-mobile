import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import SearchIcon from '../../assets/svg/icon/SearchIcon';

const SearchBar = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SearchScreen')}
      style={{ marginTop: 10, marginBottom: 10, paddingHorizontal: 15 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderRadius: 14,
          backgroundColor: '#F6F6F6',
        }}
      >
        <SearchIcon />
        <Text style={{ marginLeft: 15, fontSize: 17, color: '#8E8E93' }}>Поиск продуктов</Text>
      </View>
    </TouchableOpacity>
  );
};

export default observer(SearchBar);
