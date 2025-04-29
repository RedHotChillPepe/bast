import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = ({ color = "#2C88EC" }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
    >
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m5.333 8.324 2.829 2.828 5.656-5.657M2 8.324l2.828 2.828m5.657-5.657L8.333 7.667"
        />
    </Svg>
)
export default SvgComponent
