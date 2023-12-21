import React from 'react';
import { Svg, Path } from 'react-native-svg';

function LocationIcon() {
  return (
    <Svg width="16" height="20" fill="none" viewBox="0 0 8 12">
      <Path
        fill="#8E8E92"
        fillRule="evenodd"
        d="M3.879.828C1.739.828 0 2.508 0 4.574c0 2.563 3.471 6.326 3.619 6.485.139.15.38.15.52 0 .147-.159 3.618-3.922 3.618-6.485 0-2.065-1.74-3.746-3.878-3.746zm-.002 5.63c-1.076 0-1.951-.845-1.951-1.884 0-1.04.875-1.885 1.95-1.885 1.077 0 1.952.846 1.952 1.885 0 1.04-.875 1.885-1.951 1.885z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default LocationIcon;
