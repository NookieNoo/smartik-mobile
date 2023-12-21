import * as React from 'react';
import Svg, { Path, G, Defs, ClipPath } from 'react-native-svg';

const MyLocation = (props) => {
  return (
    <Svg fill="none" viewBox="0 0 63 118" xmlns="http://www.w3.org/2000/svg" {...props}>
      <G clipPath="url(#a)">
        <Path
          d="M32 63v54"
          stroke="#556080"
          strokeWidth={2}
          strokeMiterlimit={10}
          strokeLinecap="round"
        />
        <Path
          d="M31.5 62.759c17.397 0 31.5-14.05 31.5-31.38S48.897 0 31.5 0 0 14.049 0 31.38c0 17.33 14.103 31.379 31.5 31.379Z"
          fill="#DD352E"
        />
        <Path
          d="M20.25 29.138c3.728 0 6.75-3.01 6.75-6.724 0-3.714-3.022-6.724-6.75-6.724s-6.75 3.01-6.75 6.724c0 3.713 3.022 6.724 6.75 6.724Z"
          fill="#F76363"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h63v118H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default MyLocation;
