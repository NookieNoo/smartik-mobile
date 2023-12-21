import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native';
import debounce from 'lodash/debounce';
import styled from 'styled-components/native';
import SearchCategoryCard from './component/SearchCategoryCard';
import { useStore } from '../../store/Context';
import MoveUpIcon from '../../assets/svg/icon/MoveUpIcon';
import TwoColumnsIcon from '../../assets/svg/icon/TwoColumnsIcon';
import ThreeColumnsIcon from '../../assets/svg/icon/ThreeColumnsIcon';
import AllProducts from '../../component/AllProducts';
import SearchIcon from '../../assets/svg/icon/SearchIcon';
import ArrowLeftIcon from '../../assets/svg/icon/ArrowLeftIcon';
import CloseIcon from '../../assets/svg/icon/CloseIcon';

const SearchScreen = () => {
  const store = useStore();

  const navigation = useNavigation();
  const inputRef = useRef();

  const [query, setQuery] = useState('');
  const [upButton, setUpButton] = useState(false);

  const listRef = useRef();
  const [triggerMore, setTriggerMore] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const keyboardListenerShow = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboard(true);
    });
    const keyboardListenerHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboard(false);
    });

    return () => {
      keyboardListenerShow.remove();
      keyboardListenerHide.remove();
    };
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const search = useCallback(
    debounce(async (query) => {
      await store.product.searchFetch(query);
    }, 300),
    []
  );

  const loadCategories = async () => {
    await store.catalog.fetch();
  };

  const renderAllProducts = () => {
    return (
      <>
        <AllProductsView>
          {query === '' ? (
            <AllProductsHeader all>Все предложения</AllProductsHeader>
          ) : (
            <AllProductsHeader />
          )}
          <ChangeLayoutButton onPress={() => store.layout.setColumnNumber()}>
            {store.layout.columnsNumber === '2' ? <TwoColumnsIcon /> : <ThreeColumnsIcon />}
          </ChangeLayoutButton>
        </AllProductsView>

        {query === '' ? (
          <AllProducts
            trigger={triggerMore}
            setTrigger={() => setTriggerMore(false)}
            showHeader={false}
          />
        ) : (
          <AllProducts list={store.product.searchProducts} showHeader={false} />
        )}
      </>
    );
  };

  const moveToUp = () => {
    setUpButton(false);
    listRef.current.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <Wrapper>
      <SearchBarWrapper>
        <BackButton
          onPress={() => {
            Keyboard.dismiss();
            navigation.goBack();
          }}
        >
          <ArrowLeftIcon />
        </BackButton>
        <SearchInput
          placeholder="Поиск по товарам"
          placeholderTextColor="#8E8E93"
          autoFocus={true}
          ref={inputRef}
          onChangeText={(text) => {
            if (text === '') {
              setQuery('');
            } else {
              setQuery(text);
              search(text);
            }
          }}
        />
        <SearchIconView>
          <SearchIcon />
        </SearchIconView>
        <Loading color={store.product.loading ? '#000000' : 'transparent'} />
        {!store.product.loading && query.length ? (
          <ClearButton
            onPress={() => {
              inputRef.current.clear();
              setQuery('');
            }}
          >
            <ClearButtonView>
              <CloseIcon size="10" color="#fff" />
            </ClearButtonView>
          </ClearButton>
        ) : null}
      </SearchBarWrapper>
      <ResultWrapper>
        <FlatList
          data={store.catalog.getFilteredCategories(query)}
          ref={(ref) => {
            listRef.current = ref;
          }}
          renderItem={({ item }) => (
            <PaddingView>
              <SearchCategoryCard catalog={item} />
            </PaddingView>
          )}
          numColumns={1}
          estimatedItemSize={210}
          ItemSeparatorComponent={() => <View style={{ paddingBottom: 10 }} />}
          ListEmptyComponent={
            !store.product.loading &&
            !store.catalog.loading &&
            store.product.searchProducts.length === 0 ? (
              <EmptySearchData>
                <Text style={{ fontSize: 19 }}>Ничего не найдено</Text>
              </EmptySearchData>
            ) : null
          }
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            <AllProductsMargin keyboard={keyboard}>{renderAllProducts()}</AllProductsMargin>
          }
          ListHeaderComponent={() => (
            <AllProductsText main>
              {query === '' ? 'Категории' : 'Результат поиска'}
            </AllProductsText>
          )}
          onEndReached={() => {
            setTriggerMore(!triggerMore);
            setUpButton(true);
          }}
          onScroll={(e) => {
            if (e.nativeEvent.contentOffset.y < 5) {
              setUpButton(false);
            } else if (e.nativeEvent.contentOffset.y > 300) {
              setUpButton(true);
            }
          }}
          keyboardShouldPersistTaps="handled"
        />
      </ResultWrapper>
      {upButton && (
        <UpButton onPress={moveToUp}>
          <MoveUpIcon />
        </UpButton>
      )}
    </Wrapper>
  );
};

export default observer(SearchScreen);

const Wrapper = styled(KeyboardAvoidingView)`
  flex: 1;
  flex-direction: column;
  background-color: #f7f7f7;
`;
const SearchBarWrapper = styled.View`
  flex-direction: row;
  margin-top: 55px;
  padding-left: 10px;
  align-items: center;
`;
const BackButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 52px;
  background: #f6f6f6;
  border-radius: 14px;
`;
const SearchInput = styled.TextInput`
  flex: 1;
  flex-direction: row;
  margin-left: 5px;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 40px;
  border-radius: 14px;
  background: #f6f6f6;
  font-size: 17px;
`;
const ResultWrapper = styled.View`
  flex: 1;
`;
const AllProductsText = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: #979797;
  margin-top: ${(props) => (props.all ? '25px' : '10px')}
  margin-left: ${(props) => (props.main ? '10px' : '0')};
  margin-bottom: 10px
`;
const EmptySearchData = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 70px;
`;
const ClearButton = styled.TouchableOpacity`
  position: absolute;
  right: 30px;
`;
const Loading = styled(ActivityIndicator)`
  right: 30px;
`;
const UpButton = styled.TouchableOpacity`
  height: 54px;
  width: 54px;
  border-radius: 27px;
  background-color: #8356ce;
  position: absolute;
  justify-content: center;
  align-items: center;
  bottom: 50px;
  left: 15px;
  z-index: 10;
`;
const AllProductsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  margin-bottom: 18px;
`;
const AllProductsHeader = styled.Text`
  font-weight: 500;
  font-size: 15px;
  color: #979797;
  margin-top: ${(props) => (props.all ? '25px' : '10px')}
  margin-left: ${(props) => (props.main ? '10px' : '0')};
  margin-bottom: 10px
`;
const ChangeLayoutButton = styled.TouchableOpacity`
  margin-right: 7px;
  padding: 10px;
  top: 5px;
`;
const PaddingView = styled.View`
  padding-horizontal: 10px;
`;
const SearchIconView = styled.View`
  position: absolute;
  left: 85px;
  top: 20px;
`;
const ClearButtonView = styled.View`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #8e8e93;
  justify-content: center;
  align-items: center;
`;
const AllProductsMargin = styled.View`
  margin-bottom: ${(props) => (props.keyboard ? Keyboard.metrics().height : 30)}px;
`;
