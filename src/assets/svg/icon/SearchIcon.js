import React from 'react';
import { Svg, Path } from 'react-native-svg';

function SearchIcon() {
  return (
    <Svg width="13" height="14" fill="none" viewBox="0 0 13 14">
      <Path
        fill="#8E8E93"
        fillRule="evenodd"
        d="M9.915 9.624l2.401 2.438a.803.803 0 01-.014 1.143.785.785 0 01-.556.234.785.785 0 01-.556-.234l-2.496-2.534a5.602 5.602 0 01-3.01.881C2.55 11.552 0 8.962 0 5.78 0 2.598 2.55.008 5.683.008s5.684 2.59 5.684 5.772a5.822 5.822 0 01-1.452 3.844zM5.683 1.62c-2.265 0-4.096 1.873-4.096 4.16 0 2.3 1.844 4.16 4.096 4.16s4.083-1.873 4.083-4.16-1.818-4.16-4.083-4.16z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SearchIcon;
