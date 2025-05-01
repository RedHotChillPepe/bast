import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = ({ size = 24 }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m15 19-7-7 7-7"
        />
    </Svg>
)
export default SvgComponent
