import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m10.625 7.29-3.5 3.427-1.75-1.714M1 12.26V7.677c0-.457 0-.686.057-.9.05-.188.134-.367.245-.528.127-.182.302-.333.654-.635l4.202-3.6c.652-.558.978-.837 1.345-.944.324-.093.67-.093.993 0 .368.107.695.386 1.348.946l4.2 3.598c.352.302.527.453.654.635.112.161.194.34.245.529.057.213.057.442.057.9v4.584c0 .957 0 1.437-.19 1.803a1.732 1.732 0 0 1-.766.748c-.374.187-.863.187-1.841.187H3.797c-.978 0-1.468 0-1.842-.187a1.73 1.73 0 0 1-.764-.748C1 13.698 1 13.218 1 12.259Z"
        />
    </Svg>
)
export default SvgComponent 
