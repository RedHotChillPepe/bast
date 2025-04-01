import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={11}
    fill="none"
  >
    <Path
      stroke="#F2F2F7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="m9 9.5-4-4m0 0-4-4m4 4 4-4m-4 4-4 4"
    />
  </Svg>
)
export default SvgComponent 
