import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        fill="none"
    >
        <Path
            stroke="gray"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m13.5 13 6 6m-11-4a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
        />
    </Svg>
)
export default SvgComponent 
