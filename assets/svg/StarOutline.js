import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={17}
        height={16}
        fill="none"
    >
        <Path
            stroke="#F2B447"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1.123 6.71a.372.372 0 0 1 .214-.646l4.582-.532a.381.381 0 0 0 .302-.214l1.933-4.1a.385.385 0 0 1 .693-.001l1.933 4.1c.055.119.169.2.3.215l4.583.532a.372.372 0 0 1 .214.645L12.49 9.776a.368.368 0 0 0-.115.347l.899 4.43c.063.312-.277.554-.561.398l-4.026-2.206a.388.388 0 0 0-.373 0l-4.026 2.206c-.284.156-.625-.086-.562-.399l.9-4.429a.369.369 0 0 0-.115-.347L1.123 6.709Z"
        />
    </Svg>
)
export default SvgComponent 
