import * as React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

const EmptyCart = (props) => {
  return (
    <Svg viewBox="0 0 64 64" {...props}>
      <Circle cx={32} cy={32} fill="#e1e1ef" r={28} />
      <Path
        d="M59.85 12.03v20l-1.56 2.19-3.13 1.69-38.06 5.81-.09-.49-5.12-28.95-.04-.25z"
        fill="#9e9ecc"
      />
      <Path d="m21.49 40.54-4.48.69-5.12-28.95h4.6z" fill="#e4e0fa" />
      <Path
        d="M54.91 12.28v18.43a4.9 4.9 0 0 1-.91 2.84A5 5 0 0 1 52.35 35l-2.13 1.15-28.73 4.39-5-28.26z"
        fill="#c9c1f5"
      />
      <Path d="M43.9 12a8.08 8.08 0 1 1-8.08-8 8.07 8.07 0 0 1 8.08 8z" fill="#f47e86" />
      <Path
        d="M41 14.92a8 8 0 0 1-.56 2.94 7.49 7.49 0 0 1-.52 1.14A8.08 8.08 0 0 1 28.84 8 7.49 7.49 0 0 1 30 7.41a7.93 7.93 0 0 1 3-.57 8.08 8.08 0 0 1 8 8.08z"
        fill="#ffb4b4"
      />
      <Path
        d="M41 14.92a8 8 0 0 1-.56 2.94 7.84 7.84 0 0 1-3 .57 8.08 8.08 0 0 1-8.08-8.08A8 8 0 0 1 30 7.41a7.93 7.93 0 0 1 3-.57 8.08 8.08 0 0 1 8 8.08z"
        fill="#ff9595"
      />
      <G fill="none">
        <Circle cx={22.89} cy={56.42} r={3.64} />
        <Circle cx={51.14} cy={56.42} r={3.64} />
        <Circle cx={22.88} cy={56.41} r={3.64} />
        <Circle cx={51.13} cy={56.41} r={3.64} />
      </G>
      <Path
        d="M26.66 56.41a3.62 3.62 0 0 1-2.77 3.52A3.58 3.58 0 0 1 23 60a3.64 3.64 0 1 1 3.64-3.63zM54.91 56.41a3.64 3.64 0 1 1-3.64-3.64 3.62 3.62 0 0 1 3.64 3.64z"
        fill="#9e9ecc"
      />
      <Path
        d="M24.36 58.16a3.52 3.52 0 0 1-.47 1.77A3.58 3.58 0 0 1 23 60a3.62 3.62 0 0 1-3.17-5.41 3.62 3.62 0 0 1 4.51 3.53zM52.61 58.16a3.51 3.51 0 0 1-.46 1.77 3.63 3.63 0 0 1-4.52-3.52 3.61 3.61 0 0 1 .47-1.78 3.62 3.62 0 0 1 4.51 3.53z"
        fill="#c9c1f5"
      />
      <G fill="#616199" data-name="Layer 2">
        <Path d="M60 49H17.48c-4.76 0-4.76-2.19-4.76-3a2.48 2.48 0 0 1 1-1.84 5.75 5.75 0 0 1 3-1.13l.39-.07h.09L54.63 37a7.19 7.19 0 0 0 6.09-7.14V12a1 1 0 0 0-1-1H44.88a9.07 9.07 0 0 0-18 0H12.5l-.72-4a4.81 4.81 0 0 0-4.73-4H3.72a1 1 0 1 0 0 2h3.33a2.81 2.81 0 0 1 2.76 2.3l6 33.83a7.57 7.57 0 0 0-3.4 1.47 4.42 4.42 0 0 0-1.69 3.4c0 1.87.88 5 6.76 5H60a1 1 0 0 0 0-2zM35.86 5a7.08 7.08 0 1 1-7.08 7 7.09 7.09 0 0 1 7.08-7zm-9 8.08a9.07 9.07 0 0 0 18 0h13.86v16.81a5.19 5.19 0 0 1-4.41 5.16l-36.48 5.8L12.86 13zM22.92 51.77a4.64 4.64 0 1 0 4.64 4.63 4.64 4.64 0 0 0-4.64-4.63zm0 7.27a2.64 2.64 0 1 1 2.64-2.64 2.64 2.64 0 0 1-2.64 2.6zM51.17 51.77a4.64 4.64 0 1 0 4.64 4.63 4.64 4.64 0 0 0-4.64-4.63zm0 7.27a2.64 2.64 0 1 1 2.64-2.64 2.64 2.64 0 0 1-2.64 2.6z" />
        <Path d="M31.94 15.89a1 1 0 0 0 1.41 0l2.44-2.44 2.44 2.44a1 1 0 0 0 .71.3 1 1 0 0 0 .71-1.71L37.21 12l2.44-2.4a1 1 0 0 0-1.42-1.41l-2.44 2.44-2.44-2.44a1 1 0 0 0-1.41 0 1 1 0 0 0 0 1.41l2.44 2.4-2.44 2.44a1 1 0 0 0 0 1.45z" />
      </G>
    </Svg>
  );
};

export default EmptyCart;