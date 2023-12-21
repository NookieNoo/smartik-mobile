import React from 'react';
import { Svg, Rect } from 'react-native-svg';

function ProductMinusIcon({ color = '#fff', widthSize = '20' }) {
  return (
    <Svg width={widthSize} height="3" fill="none" viewBox="0 0 28 3">
      <Rect width="26.286" height="2.556" x="0.857" y="0.357" fill={color} rx="1.278" />
    </Svg>
  );
}

export default ProductMinusIcon;
