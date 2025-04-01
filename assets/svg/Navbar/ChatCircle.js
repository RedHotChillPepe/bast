import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ChatCircle = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="gray"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      d="M8.41 19.802a9 9 0 1 0-3.312-3.312l.004.005c.073.127.11.191.127.252.015.057.02.108.016.168-.005.063-.026.129-.07.26l-.769 2.307v.003c-.163.487-.244.73-.186.892.05.142.162.253.303.304.162.057.404-.023.889-.185l.006-.002 2.306-.769c.132-.044.199-.066.262-.07.06-.004.11.001.167.017.061.017.125.054.253.127l.004.003Z"
    />
  </Svg>
)
export default ChatCircle
