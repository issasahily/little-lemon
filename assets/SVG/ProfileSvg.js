import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const ProfileSvg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 128 128"
    {...props}
  >
    <Circle cx={64} cy={64} r={64} fill="#4B5F83" />
    <Path
      fill="#E6E6E6"
      d="M64 99h35c0-16-10.4-29-24.6-33.4C80.1 62 84 55.7 84 48.5c0-11-9-20-20-20"
    />
    <Path
      fill="#FFF"
      d="M64 28.5c-11 0-20 9-20 20 0 7.2 3.9 13.6 9.6 17.1C39.4 70 29 83 29 99h35"
    />
  </Svg>
);
export default ProfileSvg;
