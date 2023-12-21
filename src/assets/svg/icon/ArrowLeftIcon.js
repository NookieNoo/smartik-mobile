import React from 'react';
import { Svg, Path } from 'react-native-svg';

function ArrowLeftIcon() {
  return (
    <Svg width="25" height="25" fill="none" viewBox="0 0 24 24">
      <Path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 12h14M5 12l6-6m-6 6l6 6"
      />
    </Svg>
  );
}

export default ArrowLeftIcon;
