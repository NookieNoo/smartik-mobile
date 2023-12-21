import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { ThemeProvider } from 'styled-components';

const Styled = ({ children }) => {
  const { width, height } = Dimensions.get('window');
  const theme = useMemo(() => {
    return {
      width,
      height,
    };
  }, [width]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default observer(Styled);
