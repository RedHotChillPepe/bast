import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={25}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M15 19.5c0-2.21-2.686-4-6-4s-6 1.79-6 4m12-6h6m-12-1a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
        />
    </Svg>
)
export default SvgComponent
