import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = ({ color = "#2C88EC" }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M15 19c0-2.21-2.686-4-6-4s-6 1.79-6 4M16.828 5.172a3.999 3.999 0 0 1 0 5.657M19 3a7.07 7.07 0 0 1 0 10M9 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
    />
  </Svg>
);
export { SvgComponent as ReferallIcon };
