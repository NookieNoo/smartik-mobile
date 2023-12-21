import React from 'react';
import { Svg, Path } from 'react-native-svg';

function TickIcon() {
  return (
    <Svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <Path
        stroke="#8356CE"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        d="M3.5 12l6.667 5.5L20 6"
      />
    </Svg>
  );
}

export default TickIcon;
