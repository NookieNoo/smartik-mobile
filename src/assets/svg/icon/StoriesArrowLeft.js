import React from 'react';
import { Svg, Path } from 'react-native-svg';

function StoriesArrowLeftIcon(props) {
  return (
    <Svg width="47" height="35" fill="none" viewBox="0 0 47 35">
      <Path
        fill={props.color}
        d="M19.943 4.343a2.083 2.083 0 10-2.873-3.018l2.873 3.018zM1.445 16.206a2.083 2.083 0 002.873 3.018l-2.873-3.018zm2.873 0a2.083 2.083 0 00-2.873 3.018l2.873-3.018zM17.07 34.105a2.083 2.083 0 102.873-3.018l-2.873 3.018zM2.88 15.632a2.083 2.083 0 100 4.166v-4.166zm41.667 4.166a2.083 2.083 0 000-4.166v4.166zM17.07 1.325L1.445 16.206l2.873 3.018L19.943 4.343 17.07 1.325zM1.445 19.224l15.625 14.88 2.873-3.017-15.625-14.88-2.873 3.017zm1.436.574h41.667v-4.166H2.881v4.166z"
      />
    </Svg>
  );
}

export default StoriesArrowLeftIcon;
