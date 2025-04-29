import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={34}
        height={34}
        fill="none"
        {...props}
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M5.668 24.084h8.5M5.668 17h12.75m7.083-1.416v11.333m0 0 4.25-4.25m-4.25 4.25-4.25-4.25M5.668 9.917h17"
        />
    </Svg>
)
export default SvgComponent
