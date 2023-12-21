import React from 'react';
import { Svg, Path } from 'react-native-svg';

function LockIcon() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width="10" height="12" fill="none" viewBox="0 0 10 12">
      <Path
        fill="#59BC5E"
        d="M5 1.199c.987 0 1.786.826 1.786 1.846v1.478H3.214V3.045c0-1.02.8-1.846 1.786-1.846zM2.143 3.045v1.478h-.714C.64 4.523 0 5.185 0 6v4.432c0 .814.64 1.477 1.429 1.477H8.57c.788 0 1.429-.663 1.429-1.477V6c0-.815-.64-1.477-1.429-1.477h-.714V3.045C7.857 1.413 6.578.091 5 .091c-1.578 0-2.857 1.322-2.857 2.954zm-.714 2.586H8.57c.197 0 .358.166.358.369v4.432c0 .203-.161.369-.358.369H1.43a.364.364 0 01-.358-.37V6c0-.203.161-.37.358-.37zm4.107 1.846A.544.544 0 005 6.923a.544.544 0 00-.536.554v1.477c0 .307.24.554.536.554a.544.544 0 00.536-.554V7.477z"
      />
    </Svg>
  );
}

export default LockIcon;
