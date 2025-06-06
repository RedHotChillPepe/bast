import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={18}
        height={18}
        fill="none"
    >
        <Path
            stroke="gray"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M16.7 14.171V8.623c0-.534 0-.802-.065-1.05a1.998 1.998 0 0 0-.28-.617c-.145-.213-.345-.39-.747-.741l-4.8-4.2c-.747-.654-1.12-.98-1.54-1.104-.37-.11-.765-.11-1.135 0-.42.124-.793.45-1.538 1.102L1.793 6.215c-.402.352-.603.528-.747.74a2 2 0 0 0-.28.618C.7 7.82.7 8.089.7 8.623v5.548c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083c.367.152.833.152 1.765.152.932 0 1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083c.152-.367.152-.833.152-1.765v-1a2 2 0 1 1 4 0v1c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083c.367.152.833.152 1.765.152.932 0 1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083c.152-.367.152-.833.152-1.765Z"
        />
    </Svg>
)
export default SvgComponent 
