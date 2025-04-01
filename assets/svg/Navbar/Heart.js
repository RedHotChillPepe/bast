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
            stroke="gray"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M12.1 7.694C10.1 3 3.1 3.5 3.1 9.5s9 11 9 11 9-5 9-11-7-6.5-9-1.806Z"
        />
    </Svg>
)
export default SvgComponent 
