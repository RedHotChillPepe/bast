import Svg, { Path } from "react-native-svg";
const SvgComponent = ({ color = "gray" }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M12 7.694C10 3 3 3.5 3 9.5s9 11 9 11 9-5 9-11-7-6.5-9-1.806Z"
    />
  </Svg>
);
export { SvgComponent as HeartIcon };
