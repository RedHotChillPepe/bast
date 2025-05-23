import * as React from "react"
import Svg, { Circle } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={4}
        height={5}
        fill="none"
        {...props}
    >
        <Circle cx={2} cy={2.5} r={2} fill="#808080" />
    </Svg>
)
export default SvgComponent