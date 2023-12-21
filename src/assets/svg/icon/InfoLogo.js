import React from 'react';
import { Svg, Path } from 'react-native-svg';

function InfoLogo() {
  return (
    <Svg width="20" height="20" fill="none" viewBox="0 0 20 20">
      <Path
        stroke="#979797"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.25"
        d="M4.166 9.168v1.667a5 5 0 005 5h1.667a5 5 0 005-5V9.168a5 5 0 00-5-5H9.166a5 5 0 00-5 5z"
        clipRule="evenodd"
      />
      <Path stroke="#979797" strokeLinecap="round" strokeWidth="1.25" d="M10 10.002v3.333" />
      <Path fill="#979797" d="M10 7.917a.417.417 0 110-.834.417.417 0 010 .834z" />
      <Path fill="#979797" d="M10 6.668a.833.833 0 110 1.667.833.833 0 010-1.667z" />
    </Svg>
  );
}

export default InfoLogo;
