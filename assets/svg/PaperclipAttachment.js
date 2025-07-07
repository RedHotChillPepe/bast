import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = ({ color = "gray" }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={34} height={34} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m6.426 16.241 9.767-9.767A7.438 7.438 0 1 1 26.71 16.993l-11.27 11.27A4.958 4.958 0 1 1 8.43 21.25l11.27-11.27a2.48 2.48 0 0 1 3.506 3.506l-9.767 9.767"
    />
  </Svg>
);
export default SvgComponent;
