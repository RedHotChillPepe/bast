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
      d="m9 6 3-3m0 0 3 3m-3-3v10m-5-3c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C4 11.602 4 12.068 4 13v4.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218h9.607c1.118 0 1.677 0 2.104-.218.376-.192.682-.498.874-.874.218-.428.218-.987.218-2.105V13c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C18.398 10 17.932 10 17 10"
    />
  </Svg>
);
export { SvgComponent as ShareIcon };
