import React from 'react';
import { Svg, Path } from 'react-native-svg';

function StoriesCloseIcon({ color = '#fff' }) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
      <Path
        fill={color}
        d="M.636 12.303a.75.75 0 101.06 1.06l-1.06-1.06zM7.53 7.53a.75.75 0 00-1.06-1.06l1.06 1.06zM6.47 6.47a.75.75 0 101.06 1.06L6.47 6.47zm6.894-4.773a.75.75 0 10-1.061-1.06l1.06 1.06zM7.53 6.47a.75.75 0 00-1.06 1.06l1.06-1.06zm4.773 6.894a.75.75 0 001.06-1.06l-1.06 1.06zM6.47 7.53a.75.75 0 001.06-1.06L6.47 7.53zM1.697.636a.75.75 0 10-1.06 1.061l1.06-1.06zm0 12.728L7.53 7.53 6.47 6.47.636 12.303l1.06 1.06zM7.53 7.53l5.833-5.833-1.06-1.06L6.47 6.47l1.06 1.06zm-1.06 0l5.833 5.834 1.06-1.06L7.53 6.47 6.47 7.53zm1.06-1.06L1.697.636.637 1.697 6.47 7.53l1.06-1.06z"
      />
    </Svg>
  );
}

export default StoriesCloseIcon;
