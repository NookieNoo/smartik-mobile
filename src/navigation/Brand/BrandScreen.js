import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/Context';
import { FlatList, Image, Text, View } from 'react-native';
import Http from '../../initialize/Http';
import config from '../../config';
import ProductCard from '../../component/template/ProductCard';
import { StatusBar } from 'expo-status-bar';

const BrandScreen = ({ route }) => {
  const { brand } = route.params;
  const store = useStore();
  const navigation = useNavigation();
  const isVisible = useIsFocused();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isVisible || !data) return;
    navigation.setOptions({
      headerTitle: data.brand.name,
      headerStyle: {
        backgroundColor: data.brand.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTintColor: data.brand.color ?? '#000000',
      headerRight: () => (
        <Image
          source={{ uri: config.imageUrl + '/media/brand/' + data.brand.slug }}
          style={{ width: 44, height: 44, marginRight: 15 }}
        />
      ),
    });
  }, [isVisible, data]);

  useEffect(() => {
    load();
  }, [brand]);

  const load = async () => {
    const result = await Http.get('/brand/' + brand + '/products');
    if (result.success) {
      setData(result.data);
    }
  };

  return (
    <>
      <StatusBar style={data?.brand?.color === '#ffffff' ? 'light' : 'dark'} />
      <FlatList
        data={!data ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : data.actuals}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            style={{
              paddingRight: 10,
              maxWidth: '33.3333%',
              height: 240,
            }}
          />
        )}
        numColumns={3}
        estimatedItemSize={210}
        ItemSeparatorComponent={() => <View style={{ paddingBottom: 10 }} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20 }}
      />
    </>
  );
};

export default observer(BrandScreen);
