import { observer } from 'mobx-react-lite';
import { Text } from 'react-native';
import Ticker from 'react-native-ticker';
import { price as tickerPrice } from '../config/helper';
import styled from 'styled-components/native';

const Price = ({ price, style, round = false, children }) => {
  let result = price ?? children;
  if (Array.isArray(result)) {
    result = result.join('');
  }
  if (parseFloat(result) != result) {
    return <Text style={style}>{result}</Text>;
  }
  return <Ticker textStyle={style}>{tickerPrice(result, round)}</Ticker>;
};

export default observer(Price);

const Wrapper = styled.View``;
