import React from 'react';
import { Svg, Path } from 'react-native-svg';

function AddressLocationIcon() {
  return (
    <Svg width="10" height="15" fill="none" viewBox="0 0 10 15">
      <Path
        fill="#8E8E92"
        fillRule="evenodd"
        d="M5 .758c-2.757 0-5 2.275-5 5.07 0 3.47 4.475 8.564 4.665 8.779a.446.446 0 00.67 0C5.525 14.392 10 9.298 10 5.829c0-2.796-2.243-5.07-5-5.07zM4.998 8.38c-1.387 0-2.516-1.145-2.516-2.551 0-1.407 1.129-2.551 2.516-2.551s2.515 1.144 2.515 2.55c0 1.407-1.128 2.552-2.515 2.552z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default AddressLocationIcon;
