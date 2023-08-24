import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Onboarding from "./Screens/Onboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Screens/Profile";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Settings from "./Screens/Settings";
import Home from "./Screens/Home";
const Stack = createNativeStackNavigator();
function SplashScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Getting token...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}
export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const getUserToken = async () => {
    // testing purposes
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
      // custom logi

      await sleep(2000);
      const status = await AsyncStorage.getItem("isOnboardingComplete");
      setIsOnboardingComplete(JSON.parse(status));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        getUserToken();
      } catch (e) {}
    })();
  }, []);
  if (isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={isOnboardingComplete ? "home" : "onboarding"}
        >
          <Stack.Screen name="onboarding" component={Onboarding} />
          <Stack.Screen name="profile" component={Profile} />
          <Stack.Screen name="settings" component={Settings} />
          <Stack.Screen name="home" component={Home} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
