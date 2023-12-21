import React from 'react';
import { Svg, Path } from 'react-native-svg';

function StoriesArrowRightIcon(props) {
  return (
    <Svg width="47" height="35" fill="none" viewBox="0 0 47 35">
      <Path
        fill={props.color}
        d="M27.057 31.086a2.083 2.083 0 102.873 3.017l-2.873-3.017zm18.498-11.864a2.083 2.083 0 10-2.873-3.017l2.873 3.017zm-2.873 0a2.083 2.083 0 002.873-3.017l-2.873 3.017zM29.93 1.324a2.083 2.083 0 10-2.873 3.017l2.873-3.017zM44.12 19.797a2.083 2.083 0 000-4.167v4.167zM2.452 15.63a2.083 2.083 0 000 4.167V15.63zM29.93 34.103l15.625-14.88-2.873-3.018-15.625 14.881 2.873 3.017zm15.625-17.898L29.93 1.325 27.057 4.34l15.625 14.881 2.873-3.017zm-1.436-.575H2.452v4.167h41.667V15.63z"
      />
    </Svg>
  );
}

export default StoriesArrowRightIcon;
