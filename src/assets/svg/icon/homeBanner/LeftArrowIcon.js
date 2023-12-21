import React from 'react';
import { Svg, Rect, Path } from 'react-native-svg';

function LeftArrowIcon() {
  return (
    <Svg width="15" height="16" fill="none" viewBox="0 0 15 16">
      <Rect
        width="15"
        height="15"
        x="15"
        y="15.5"
        fill="#fff"
        fillOpacity="0.5"
        rx="7.5"
        transform="rotate(180 15 15.5)"
      />
      <Path
        stroke="#353535"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.107 11.75L5.42 8.062l3.688-3.689"
      />
    </Svg>
  );
}

export default LeftArrowIcon;
