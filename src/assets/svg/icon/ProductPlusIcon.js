import React from 'react';
import { Svg, Path } from 'react-native-svg';

function ProductPlusIcon({ color = '#fff', size = '20' }) {
  return (
    <Svg width={size} height={size} fill="none" viewBox="0 0 28 28">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M15.643 2.1a1.243 1.243 0 10-2.486 0v10.257H2.135a1.278 1.278 0 000 2.556h11.022V25.9a1.243 1.243 0 002.486 0V14.913h10.222a1.278 1.278 0 000-2.556H15.643V2.101z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default ProductPlusIcon;
