import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={24}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M20.3 21c0-2.761-3.581-5-8-5-4.418 0-8 2.239-8 5m8-8a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
        />
    </Svg>
)
export default SvgComponent 
