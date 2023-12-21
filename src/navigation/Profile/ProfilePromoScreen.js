import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import Http from '../../initialize/Http';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../store/Context';
import PromoShareComponent from './components/PromoShareComponent';
import ArrowRightButtonIcon from '../../assets/svg/icon/ArrowRightButtonIcon';
import dayjs from 'dayjs';

const ProfilePromoScreen = ({ route }) => {
  const navigation = useNavigation();
  const store = useStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSegment, setActiveSegment] = useState(
    route.params?.initial === 'myPromo' ? 'myPromo' : 'sharePromo'
  );

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#F7F7F7',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await Http.get('/profile/promo');
    if (result.success) setData(result.data.list);
    setLoading(false);
  };

  const PromoItem = ({ item, index }) => (
    <PromoWrapper
      onPress={() =>
        navigation.navigate('Profile', {
          screen: 'ProfilePromoViewScreen',
          params: { promo: item.promo, index: index + 1 },
        })
      }
    >
      <LeftSide>
        <PromoNumber>{`Промокод №${index + 1}`}</PromoNumber>
        <Text style={{ fontSize: 17 }}>{item.promo.name}</Text>
        <Text
          style={{
            marginTop: 5,
            color: item.promo.active ? '#38B54D' : '#FF3B30',
            fontWeight: '500',
          }}
        >
          {item.promo.active ? 'Активный' : 'Неактивен'}
        </Text>
      </LeftSide>
      <RightSide>
        {item.promo.ended_at && (
          <DueDateText>{`Действителен до\n${dayjs(item.promo.ended_at).format(
            'DD.MM.YYYY'
          )}`}</DueDateText>
        )}

        <ArrowRightButtonIcon />
      </RightSide>
    </PromoWrapper>
  );

  return (
    <Wrapper>
      <SegmentWrapper>
        <SegmentItem
          onPress={() => setActiveSegment('sharePromo')}
          active={activeSegment === 'sharePromo'}
        >
          <SegmentText>Поделиться</SegmentText>
        </SegmentItem>
        <SegmentItem
          onPress={() => setActiveSegment('myPromo')}
          active={activeSegment === 'myPromo'}
        >
          <SegmentText>Мои промокоды</SegmentText>
        </SegmentItem>
      </SegmentWrapper>
      {activeSegment === 'myPromo' ? (
        <>
          {store.user.confirmed ? (
            <FlatList
              data={data}
              renderItem={({ item, index }) => <PromoItem item={item} index={index} />}
              contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}
            />
          ) : (
            <EmptyWrapper>
              <Title>Чтобы увидеть свои заказы,{'\n'}авторизйтесь</Title>
              <AuthButton
                onPress={() =>
                  navigation.navigate('ModalNavigation', {
                    screen: 'LoginPhoneScreen',
                  })
                }
              >
                <AuthButtonText>Авторизоваться</AuthButtonText>
              </AuthButton>
            </EmptyWrapper>
          )}
        </>
      ) : (
        <PromoShareComponent />
      )}
    </Wrapper>
  );
};

export default observer(ProfilePromoScreen);

const Wrapper = styled(View)`
  flex: 1;
  background-color: #f7f7f7;
`;
const SegmentWrapper = styled.View`
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 15px;
`;
const SegmentItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => (props.active ? '#E3E3E3' : 'transparent')};
  padding: 8px 18px;
  border-radius: 8px;
  margin: 0 5px;
`;
const SegmentText = styled.Text`
  font-weight: 500;
  font-size: 12px;
`;
const PromoWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #efeff4;
`;
const LeftSide = styled(View)`
  flex: 1;
`;
const PromoShareItem = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  background-color: #fefefe;
  border-radius: 8px;
  padding: 15px 10px;
  box-shadow: 1px 2px 2px #00000033;
`;
const PromoShareName = styled.Text`
  font-size: 17px;
  font-weight: 500;
`;
const PromoParamsWrapper = styled.View`
  flex-direction: row;
  margin-top: 10px;
`;
const PromoCodeValue = styled.View`
  border-radius: 3px;
  background-color: #8256ce;
  margin-left: 5px;
`;
const PromoCodeValueText = styled.Text`
  color: #ffffff;
  padding: 2px 6px;
  font-weight: 500;
`;
const EmptyWrapper = styled(View)`
  width: 85%;
  border-radius: 8px;
  background-color: #ffffff;
  align-self: center;
  margin-top: 40px;
  align-items: center;
  shadow-color: rgba(0, 0, 0, 0.3);
  shadow-offset: 5px 5px;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
`;
const Title = styled(Text)`
  font-weight: 400;
  font-size: 14px;
  color: #979797;
  margin-top: 20px;
  text-align: center;
`;
const AuthButton = styled(TouchableOpacity)`
  margin-bottom: 20px;
  background-color: #8356ce;
  border-radius: 8px;
  margin-top: 28px;
`;
const AuthButtonText = styled(Text)`
  font-size: 14px;
  letter-spacing: -0.4px;
  font-weight: 500;
  padding-vertical: 15px;
  padding-horizontal: 20px;
  color: #ffffff;
`;
const PromoNumber = styled.Text`
  color: #8e8e92;
  font-size: 10px;
  font-weight: 400;
`;
const RightSide = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const DueDateText = styled.Text`
  color: #8e8e92;
  font-size: 10px;
  font-weight: 400;
  margin-right: 10px;
`;
