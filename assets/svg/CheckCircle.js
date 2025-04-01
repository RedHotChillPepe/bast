import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CheckCircle = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2C88EC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m10.333 6.444-3.11 3.112L5.666 8M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Z"
    />
  </Svg>
)
export default CheckCircle
