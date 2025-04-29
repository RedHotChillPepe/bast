import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={19}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2C88EC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M.668 15.084h8.5M.668 8h12.75M.668.917h17M16.251 5.333l4.25-4.25m0 0 4.25 4.25m-4.25-4.25v11.333"
    />
  </Svg>
)
export default SvgComponent
