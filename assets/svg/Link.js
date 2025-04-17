import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
        {...props}
    >
        <Path
            stroke="#3E3E3E"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m6.172 11.83 5.657-5.658M4.05 8.294 2.637 9.707a4 4 0 1 0 5.657 5.656l1.412-1.414m-1.413-9.9 1.414-1.414a4 4 0 1 1 5.657 5.657L13.95 9.708"
        />
    </Svg>
)
export default SvgComponent
