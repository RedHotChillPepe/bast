import * as React from "react"
import { Path, Svg } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={19}
        fill="none"
        {...props}
    >
        <Path
            stroke="#2C88EC"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="m9 12.5 3-3m0 0-3-3m3 3H1m0-4.752V4.7c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C2.52 1.5 3.08 1.5 4.2 1.5h9.6c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.218.427.218.987.218 2.105v9.607c0 1.117 0 1.676-.218 2.104a2.002 2.002 0 0 1-.875.874c-.427.218-.986.218-2.104.218H4.197c-1.118 0-1.678 0-2.105-.218a2 2 0 0 1-.874-.874C1 15.98 1 15.42 1 14.3v-.05"
        />
    </Svg>
)
export { SvgComponent as LeftIcon }
