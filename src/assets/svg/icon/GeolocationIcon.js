import React from 'react';
import { Svg, Path } from 'react-native-svg';

function GeolocationIcon() {
  return (
    <Svg width="25" height="25" fill="none" viewBox="0 0 24 24">
      <Path
        fill="#0F0F0F"
        fillRule="evenodd"
        d="M19.925 1.784c1.608-.602 3.178.968 2.575 2.575L16.072 21.5c-.715 1.906-3.488 1.65-3.842-.355l-1.364-7.727-7.727-1.364c-2.005-.353-2.26-3.127-.355-3.842l17.141-6.428zm.702 1.873l-17.14 6.428 7.727 1.363a2 2 0 011.622 1.622l1.364 7.728 6.427-17.14z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default GeolocationIcon;
