import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2C88EC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M2 20h2m0 0h6m-6 0v-8.548c0-.534 0-.801.065-1.05a2 2 0 0 1 .28-.617c.145-.213.346-.39.748-.741l4.801-4.202c.746-.652 1.119-.978 1.538-1.102.37-.11.765-.11 1.135 0 .42.124.794.45 1.54 1.104l4.8 4.2c.402.352.603.528.748.74.127.19.222.398.28.618.065.249.065.516.065 1.05V20m-10 0h4m-4 0v-4a2 2 0 1 1 4 0v4m0 0h6m0 0h2"
    />
  </Svg>
);
export { SvgComponent as HouseProfileIcon };
