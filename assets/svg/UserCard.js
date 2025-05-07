import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = ({ color = "#3E3E3E" }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={34}
        height={34}
        fill="none"
    >
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M8.5 25.5H17m-8.5 0c-1.4-.001-2.134-.019-2.703-.308a2.835 2.835 0 0 1-1.238-1.24c-.309-.606-.309-1.398-.309-2.985v-7.933c0-1.587 0-2.381.309-2.987a2.832 2.832 0 0 1 1.238-1.238c.606-.309 1.4-.309 2.987-.309h16.433c1.587 0 2.38 0 2.985.309.533.271.968.705 1.24 1.238.308.605.308 1.398.308 2.982v7.942c0 1.584 0 2.376-.308 2.981a2.838 2.838 0 0 1-1.24 1.24c-.605.308-1.397.308-2.981.308H17m-8.5 0c0-1.565 1.903-2.833 4.25-2.833S17 23.935 17 25.5m-8.5 0s0 0 0 0Zm17-5.667h-5.667m5.667-4.25h-4.25m-8.5 2.834a2.833 2.833 0 1 1 0-5.667 2.833 2.833 0 0 1 0 5.667Z"
        />
    </Svg>
)
export { SvgComponent as UserCardIcon }
