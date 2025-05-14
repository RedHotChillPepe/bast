import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = ({ color = "#2C88EC" }) => (
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
            d="m14.603 19.397 6.866-6.865m7.023-4.19-5.795 18.834c-.52 1.688-.78 2.532-1.228 2.812-.388.243-.87.284-1.292.108-.488-.202-.884-.993-1.674-2.573l-3.67-7.341c-.126-.25-.189-.376-.273-.484a1.415 1.415 0 0 0-.256-.258c-.106-.082-.229-.143-.469-.263l-7.357-3.679c-1.58-.79-2.37-1.185-2.573-1.673a1.416 1.416 0 0 1 .107-1.293c.28-.448 1.124-.709 2.813-1.228l18.834-5.795c1.327-.409 1.991-.613 2.44-.448.39.143.698.45.841.841.165.449-.04 1.112-.448 2.438v.002Z"
        />
    </Svg>
)
export default SvgComponent
