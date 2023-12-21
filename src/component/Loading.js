import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Loading = () => {
  return (
    <Wrapper>
      <ActivityIndicator />
    </Wrapper>
  );
};

export default Loading;

const Wrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
