import React from 'react';
import { Svg, Path } from 'react-native-svg';

function ChatIcon() {
  return (
    <Svg width="22" height="21" fill="none" viewBox="0 0 22 21">
      <Path
        fillRule="evenodd"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.467 1.334H3.534a1.839 1.839 0 00-1.867 1.81v10.857a1.839 1.839 0 001.867 1.81h5.16c.29-.001.578.064.84.19l7.534 4L17 14h1.907a1.405 1.405 0 001.427-1.379V3.145a1.839 1.839 0 00-1.867-1.81z"
        clipRule="evenodd"
      />
      <Path
        fill="#000"
        d="M5.667 5.918a.75.75 0 000 1.5v-1.5zm10.667 1.5a.75.75 0 000-1.5v1.5zm-10.667 2.5a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zm-8-4h10.667v-1.5H5.667v1.5zm0 4h8v-1.5h-8v1.5z"
      />
    </Svg>
  );
}

export default ChatIcon;
