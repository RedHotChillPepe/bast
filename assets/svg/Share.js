import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={20}
        fill="none"
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m6 4 3-3m0 0 3 3M9 1v10M4 8c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C1 9.602 1 10.068 1 11v4.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h9.607c1.117 0 1.676 0 2.104-.218.376-.192.682-.498.874-.874.218-.428.218-.987.218-2.105V11c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C15.398 8 14.932 8 14 8"
        />
    </Svg>
)
export default SvgComponent 
