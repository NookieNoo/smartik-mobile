import React from 'react';
import { Svg, Path } from 'react-native-svg';

function BackButtonIcon() {
  return (
    <Svg width="13" height="22" fill="none" viewBox="0 0 13 22">
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M9.76 1.081l-9.364 8.99a1.288 1.288 0 000 1.858l9.363 8.988a1.483 1.483 0 102.056-2.14l-7.843-7.53a.343.343 0 010-.497l7.843-7.529a1.485 1.485 0 00-2.056-2.14z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default BackButtonIcon;
