import { observer } from 'mobx-react-lite';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { useStore } from '../store/Context';
import LogoSvg from '../assets/svg/logo.svg.js';
import { useEffect, useMemo } from 'react';
import Constants from 'expo-constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = ({}) => {
  const store = useStore();
  const { width } = useWindowDimensions();
  const logoSize = useMemo(() => {
    const ratio = width / 1282;
    return {
      width: ratio * 291,
      height: ratio * 231,
      padding: ratio * 30,
    };
  }, [width]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Wrapper>
        <LogoSvg
          width={logoSize.width ?? 0}
          height={logoSize.height ?? 0}
          style={{ left: logoSize.padding ?? 0 }}
        />
        <StatusWrapper>
          <Loading />
          <Text>{store.app.statusTitle}</Text>
          <Text>
            {['error', 'offline', 'version'].includes(store.app.status) && store.app.error}
          </Text>
          {['error', 'offline'].includes(store.app.status) ? (
            <Button onPress={() => store.app.load()}>
              <Text>Перезагрузить</Text>
            </Button>
          ) : null}
        </StatusWrapper>
      </Wrapper>
      <VersionText>
        Версия {Constants.expoConfig.version} сборка {Constants.expoConfig.runtimeVersion}{' '}
      </VersionText>
    </SafeAreaView>
  );
};

export default observer(SplashScreen);

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const StatusWrapper = styled.View`
  position: absolute;
  bottom: 200px;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const Button = styled.TouchableOpacity`
  border: 1px solid dodgerblue;
  border-radius: 3px;
  padding: 10px 15px;
  margin: 10px;
  box-shadow: 1px 2px 2px #00000033;
  background: #fff;
`;
const Loading = styled(ActivityIndicator)`
  margin-bottom: 10px;
`;
const Text = styled.Text`
  color: #999;
`;
const VersionText = styled.Text`
  font-size: 8px;
  font-weight: 400;
  color: #979797;
  align-self: center;
  margin-bottom: 4px;
`;
