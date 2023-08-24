import { Pressable } from "react-native";

const Button = ({ children, func, styl }) => {
  return (
    <Pressable onPress={func} style={styl}>
      {children}
    </Pressable>
  );
};

export default Button;
