import Svg, { Path } from "react-native-svg";
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2C88EC"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8 8H6.2c-1.12 0-1.68 0-2.108.218a1.999 1.999 0 0 0-.874.874C3 9.52 3 10.08 3 11.2v5.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h11.606c1.118 0 1.677 0 2.104-.218.377-.192.683-.498.875-.874.218-.428.218-.986.218-2.104v-5.607c0-1.118 0-1.678-.218-2.105a2.001 2.001 0 0 0-.875-.874C19.48 8 18.92 8 17.8 8H16M8 8h8M8 8a4 4 0 1 1 8 0"
    />
  </Svg>
);
export { SvgComponent as SuitCaseIcon };
