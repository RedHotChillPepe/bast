import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = ({ color = "#2C88EC" }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m10 8 4 4-4 4"
    />
  </Svg>
);
export default SvgComponent;
