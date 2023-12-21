import React from 'react';
import { Svg, Rect, Path } from 'react-native-svg';

function RightArrowIcon() {
  return (
    <Svg width="15" height="16" fill="none" viewBox="0 0 15 16">
      <Rect width="15" height="15" y="0.5" fill="#fff" fillOpacity="0.5" rx="7.5" />
      <Path
        stroke="#353535"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.893 4.25L9.58 7.938l-3.688 3.689"
      />
    </Svg>
  );
}

export default RightArrowIcon;
