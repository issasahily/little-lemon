import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
const Profile = () => {
  const [behavoir, setBehavoir] = useState("");
  useEffect(() => {
    (async () => {
      const com = await AsyncStorage.getItem("isOnboardingComplete");
      const cof = JSON.parse(com);
      setBehavoir(cof);
    })();
  }, []);
  return (
    <View>
      <Text> Profile page </Text>
      <Text> {behavoir}` </Text>
    </View>
  );
};

export default Profile;
