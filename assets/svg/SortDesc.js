import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={34}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2C88EC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M5.667 24.083h17M5.666 17h12.75M5.666 9.917h8.5m11.333 8.5V7.083m0 0 4.25 4.25m-4.25-4.25-4.25 4.25"
    />
  </Svg>
)
export default SvgComponent
