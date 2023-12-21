import { observer } from 'mobx-react-lite';
import React from 'react';
import { Pressable, View } from 'react-native';
import styled from 'styled-components/native';
import Story from './component/Story';
import { useNavigation } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';

const StoriesScreen = () => {
  const navigation = useNavigation();

  const CustomComponent = Platform.OS === 'ios' ? View : GestureRecognizer;

  return (
    <CustomComponent
      style={{
        flex: 1,
      }}
      onSwipeDown={() => navigation.goBack()}
    >
      <Wrapper>
        <View style={{ flex: 0.95 }}>
          <Story close={() => navigation.goBack()} index={0} />
        </View>
      </Wrapper>
    </CustomComponent>
  );
};

export default observer(StoriesScreen);

const Wrapper = styled(Pressable)`
  flex: 1;
  background-color: #000000;
`;
