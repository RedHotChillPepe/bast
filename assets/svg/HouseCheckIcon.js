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
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m12 8-4 4-2-2m-5 3.8V8.454c0-.535 0-.802.065-1.05a2 2 0 0 1 .28-.618c.145-.213.346-.389.748-.74l4.801-4.202C7.64 1.19 8.013.864 8.432.74c.37-.11.765-.11 1.135 0 .42.125.794.451 1.54 1.104l4.8 4.2c.403.352.603.529.748.741.127.189.222.397.28.617.065.25.065.516.065 1.05v5.352c0 1.118 0 1.678-.218 2.105a2.001 2.001 0 0 1-.875.874c-.427.218-.986.218-2.104.218H4.197c-1.118 0-1.678 0-2.105-.218a1.999 1.999 0 0 1-.874-.874C1 15.481 1 14.921 1 13.801Z"
        />
    </Svg>
)
export { SvgComponent as HouseCheckIcon }
