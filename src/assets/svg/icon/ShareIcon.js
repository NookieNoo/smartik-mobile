import React from 'react';
import { Svg, Path } from 'react-native-svg';

function ShareIcon() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 15 15">
      <Path
        fillRule="evenodd"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.053"
        d="M6.862 7.915S-.144 6.466 2.29 5.061c2.055-1.186 9.135-3.225 10.125-2.698.526.989-1.513 8.07-2.699 10.124-1.405 2.434-2.854-4.572-2.854-4.572z"
        clipRule="evenodd"
      />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.053"
        d="M6.862 7.916l5.553-5.553"
      />
    </Svg>
  );
}

export default ShareIcon;
