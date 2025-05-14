import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={20}
        fill="none"
        {...props}
    >
        <Path
            stroke="#F2F2F7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M8 16v-3m0 0v-3m0 3H5m3 0h3M9 1H4.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C1 2.52 1 3.08 1 4.2v11.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h7.606c1.118 0 1.677 0 2.104-.218.377-.192.684-.498.875-.874.218-.428.218-.986.218-2.104V7M9 1c.286.003.466.014.639.055.204.05.399.13.578.24.202.124.375.297.72.643l3.126 3.125c.346.346.518.518.642.72.11.18.19.374.24.578.04.173.051.354.054.639M9 1v2.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h2.802m0 0H15"
        />
    </Svg>
)
export { SvgComponent as UploadFileIcon }
