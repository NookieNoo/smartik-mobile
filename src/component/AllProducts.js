import { observer } from 'mobx-react-lite';
import styled from 'styled-components/native';
import { useEffect, useState } from 'react';
import Http from '../initialize/Http';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import BigCatalogCard from '../component/template/ProductCard/BigCatalogCard';
import SmallCatalogCard from './template/ProductCard/SmallCatalogCard';
import { useStore } from '../store/Context';
import TwoColumnsIcon from '../assets/svg/icon/TwoColumnsIcon';
import ThreeColumnsIcon from '../assets/svg/icon/ThreeColumnsIcon';
import { useRef } from 'react';
import { ActivityIndicator, Dimensions, Modal } from 'react-native';
import CloseIcon from '../assets/svg/icon/CloseIcon';
import TickIcon from '../assets/svg/TickIcon';
import SortIcon from '../assets/svg/icon/SortIcon';
import { View } from 'react-native';

const AllProducts = ({ list = null, trigger = false, showHeader = true, setTrigger }) => {
  const store = useStore();
  const [data, setData] = useState(list === null ? [] : list);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const endReached = useRef(false);

  const limit = 20;
  const offset = useRef(1);

  useEffect(() => {
    if (list === null) {
      loadAllProducts();
    }
  }, [store.layout.initialSort]);

  const loadAllProducts = async () => {
    setLoader(true);
    let order = '';
    if (store.layout.initialSort !== '') order = `&order=${store.layout.initialSort}`;
    offset.current = 1;
    const result = await Http.get(`/product?limit=${limit}&offset=1${order}`);
    if (result.success) {
      setData(result.data);
      offset.current = 2;
    }
    setLoader(false);
  };

  const loadMoreProducts = async () => {
    if (!endReached.current) {
      setLoader(true);
      let order = '';
      if (store.layout.initialSort !== '') order = `&order=${store.layout.initialSort}`;
      const result = await Http.get(`/product?limit=${limit}&offset=${offset.current}${order}`);
      if (result.success) {
        setData([...data, ...result.data]);
        offset.current = offset.current + 1;
        if (result.data.length === 0) {
          endReached.current = true;
        }
      }
      setLoader(false);
    }
  };

  useEffect(() => {
    if (list !== null) {
      setData(list);
    }
  }, [list]);

  useEffect(() => {
    if (trigger === true && list === null) {
      loadMoreProducts().finally(() => {
        setTrigger(false);
      });
    }
  }, [trigger]);

  const updateOrderType = (type) => {
    store.layout.setSortType(type);
    store.layout.setModalShown(false);
    setModalVisible(false);
    loadAllProducts();
  };

  const modifyArray = (type) => {
    if (data.length === 0) {
      return [];
    }

    const newArr = [];
    const chunkSize = type === 2 ? 2 : 3;

    for (let i = 0; i < data.length; i += chunkSize) {
      newArr.push(data.slice(i, i + chunkSize));
    }

    if (type !== 0 && newArr.length > 0) {
      const lastChunk = newArr[newArr.length - 1];
      while (lastChunk.length < type) {
        lastChunk.push('');
      }
    }

    return newArr;
  };

  return (
    <>
      <Wrapper
        style={{
          paddingBottom: store.cart.products.length !== 0 ? 150 : 60,
        }}
      >
        {showHeader && (
          <AllProductsView>
            <Header>Все предложения</Header>
            <ChangeButtonsView>
              <ChangeLayoutButton
                onPress={() => {
                  setData((oldData) => {
                    store.layout.setColumnNumber();
                    return oldData.slice(0, 20);
                  });
                }}
              >
                {store.layout.columnsNumber === '2' ? <TwoColumnsIcon /> : <ThreeColumnsIcon />}
              </ChangeLayoutButton>
              <ChangeSortButton
                onPress={() => {
                  store.layout.setModalShown(true);
                  setModalVisible(true);
                }}
              >
                <SortIcon />
              </ChangeSortButton>
            </ChangeButtonsView>
          </AllProductsView>
        )}

        {store.layout.columnsNumber === '2' &&
          modifyArray(2).map((arr, index) => {
            return (
              <Animated.View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
                key={index}
                entering={FadeInUp.duration(500)}
                exiting={FadeOutDown.duration(500)}
              >
                {arr.map((item, arrIndex) =>
                  item === '' ? (
                    <ItemWrapper type={'big'} key={Math.random() + arrIndex} />
                  ) : (
                    <ItemWrapper type={'big'} key={item.uuid}>
                      <BigCatalogCard product={item} price={item.prices[0]} />
                    </ItemWrapper>
                  )
                )}
              </Animated.View>
            );
          })}
        {store.layout.columnsNumber === '3' &&
          modifyArray(3).map((arr, index) => {
            return (
              <Animated.View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}
                key={index}
                entering={FadeInUp.duration(500)}
                exiting={FadeOutDown.duration(500)}
              >
                {arr.map((item, arrIndex) =>
                  item === '' ? (
                    <ItemWrapper type={'small'} key={Math.random() + arrIndex} />
                  ) : (
                    <ItemWrapper type={'small'} key={item.uuid}>
                      <SmallCatalogCard product={item} price={item.prices[0]} />
                    </ItemWrapper>
                  )
                )}
              </Animated.View>
            );
          })}
        {loader && (
          <LoaderView>
            <ActivityIndicator size={'large'} />
          </LoaderView>
        )}
      </Wrapper>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          store.layout.setModalShown(!modalVisible);
          setModalVisible(!modalVisible);
        }}
        onDismiss={() => {
          store.layout.setModalShown(false);
        }}
      >
        <ModalView>
          <SortView>
            <HandlerView />
            <CloseModalButton
              onPress={() => {
                store.layout.setModalShown(false);
                setModalVisible(false);
              }}
            >
              <CloseIcon color="#fff" />
            </CloseModalButton>
            <ModalTitle>Сортировать по</ModalTitle>
            <ModalSortButton onPress={() => updateOrderType('')}>
              <ModalSortText>По размеру скидки</ModalSortText>
              {store.layout.initialSort === '' && <TickIcon />}
            </ModalSortButton>
            <ModalSortButton onPress={() => updateOrderType('price')}>
              <ModalSortText>Возрастанию цены</ModalSortText>
              {store.layout.initialSort === 'price' && <TickIcon />}
            </ModalSortButton>
            <ModalSortButton onPress={() => updateOrderType('-price')}>
              <ModalSortText>Убыванию цены</ModalSortText>
              {store.layout.initialSort === '-price' && <TickIcon />}
            </ModalSortButton>
            <ModalSortButton onPress={() => updateOrderType('-expired_at')}>
              <ModalSortText>Сначала с большим сроком</ModalSortText>
              {store.layout.initialSort === '-expired_at' && <TickIcon />}
            </ModalSortButton>
            <ModalSortButton onPress={() => updateOrderType('expired_at')}>
              <ModalSortText>Сначала с коротким сроком</ModalSortText>
              {store.layout.initialSort === 'expired_at' && <TickIcon />}
            </ModalSortButton>
          </SortView>
        </ModalView>
      </Modal>
    </>
  );
};

export default observer(AllProducts);

const Wrapper = styled.View`
  z-index: 1;
`;
const Header = styled.Text`
  font-weight: 700;
  font-size: 17px;
  margin-left: 14px;
  line-height: 21.32px;
  margin-bottom: 15px;
  align-self: center;
`;
const ItemWrapper = styled.View`
  flex: ${(props) => (props.type === 'big' ? '0.46' : '0.31')};
  height: ${(props) => (props.type === 'big' ? '340' : '266')}px;
  margin-bottom: 10px;
`;
const AllProductsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const ChangeLayoutButton = styled.TouchableOpacity`
  margin-right: 0px;
  padding: 10px;
  bottom: 7px;
`;
const LoaderView = styled.View`
  margin-bottom: 10px;
`;
const ModalView = styled.View`
  flex: 1;
  background-color: transparent;
  justify-content: flex-end;
`;
const SortView = styled.View`
  flex: 0.5;
  background-color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-horizontal: 14px;
`;
const HandlerView = styled.View`
  background-color: #d1d1d6;
  height: 4px;
  width: 37px;
  border-radius: 16px;
  align-self: center;
  margin-top: 8px;
`;
const CloseModalButton = styled.TouchableOpacity`
  height: 34px;
  width: 34px;
  border-radius: 17px;
  background-color: #8356ce;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 10px;
`;
const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #353535;
  letter-spacing: -0.4px;
  margin-top: 16px;
  margin-bottom: 20px;
`;
const ModalSortButton = styled.TouchableOpacity`
  height: 57px;
  width: 100%;
  border-bottom-width: 1px;
  border-color: #e3e3e3;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ModalSortText = styled.Text`
  font-size: 17px;
  font-weight: 400;
  color: #353535;
`;
const ChangeButtonsView = styled.View`
  flex-direction: row;
`;
const ChangeSortButton = styled.TouchableOpacity`
  margin-right: 14px;
  padding: 10px;
  bottom: 7px;
`;
