import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M9 17h10M9 12h10M9 7h10M5.002 17v.002H5V17h.002Zm0-5v.002H5V12h.002Zm0-5v.002H5V7h.002Z"
        />
    </Svg>
)
export default SvgComponent 
