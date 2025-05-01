import * as React from "react"
import { Path, Svg } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={15}
        fill="none"
        {...props}
    >
        <Path
            stroke="gray"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M1.586 9.279c1.78 1.769 4.883 4.22 8.414 4.22 3.53 0 6.633-2.451 8.413-4.22.469-.467.704-.7.854-1.159.106-.327.106-.913 0-1.24-.15-.458-.385-.692-.854-1.159C16.633 3.952 13.53 1.5 10 1.5c-3.531 0-6.634 2.452-8.414 4.221-.47.467-.704.7-.854 1.159-.106.327-.106.913 0 1.24.15.458.385.692.854 1.159Z"
        />
        <Path
            stroke="gray"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M8 7.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
        />
    </Svg>
)
export default SvgComponent
