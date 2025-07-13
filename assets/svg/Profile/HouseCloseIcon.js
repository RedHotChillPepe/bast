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
      d="m10 15 2-2m0 0 2-2m-2 2-2-2m2 2 2 2M4 16.8v-5.348c0-.534 0-.801.065-1.05.058-.22.152-.429.28-.617.145-.213.346-.39.748-.741l4.801-4.202c.746-.652 1.119-.978 1.538-1.102.37-.11.765-.11 1.135 0 .42.124.794.45 1.54 1.104l4.8 4.2c.403.352.603.528.748.74a2 2 0 0 1 .28.618c.065.248.065.516.065 1.05v5.352c0 1.118 0 1.677-.218 2.105a2 2 0 0 1-.874.873c-.428.218-.986.218-2.104.218H7.197c-1.118 0-1.678 0-2.105-.218a1.999 1.999 0 0 1-.874-.873C4 18.48 4 17.92 4 16.8Z"
    />
  </Svg>
);
export { SvgComponent as HouseCloseIcon };
