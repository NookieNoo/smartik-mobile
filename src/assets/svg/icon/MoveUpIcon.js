import React from 'react';
import { Svg, Path } from 'react-native-svg';

function MoveUpIcon({ width = '24', height = '30' }) {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 30">
      <Path
        fill="#fff"
        d="M20.822 12.47a1.28 1.28 0 101.852-1.766l-1.852 1.765zm-7.895-12a1.28 1.28 0 10-1.853 1.764L12.927.469zm0 1.764A1.28 1.28 0 1011.074.469l1.853 1.765zm-11.6 8.47a1.28 1.28 0 101.852 1.765l-1.853-1.764zM13.28 1.352a1.28 1.28 0 10-2.559 0h2.559zm-2.559 27.294a1.28 1.28 0 102.559 0h-2.559zm11.953-17.942L12.927.47l-1.853 1.765 9.748 10.235 1.852-1.764zM11.074.47L1.326 10.705l1.853 1.764 9.748-10.235L11.074.469zm-.353.883v27.294h2.559V1.352h-2.559z"
      />
    </Svg>
  );
}

export default MoveUpIcon;
