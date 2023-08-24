import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComponent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm6 12H8.414l2.293 2.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 1 1 1.414 1.414L8.414 11H18a1 1 0 0 1 0 2Z"
      style={{
        fill: "#495E57",
      }}
    />
  </Svg>
);
export default SvgComponent;
