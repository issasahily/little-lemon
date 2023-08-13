import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  //   const passRegEx = /(?=.*[a-z])(?='gmail')(?=.*[!@#$%^?&*]).{7,}/;
  const passRegEx = /(?=.gmail)(?=.*[!@#$%^?&*])/;

  useEffect(() => {
    if (name.trim().length > 0) {
      if (passRegEx.test(email)) {
        setButtonDisable(true);
        Alert.alert("buttonDisable");
      }
    } else {
      setButtonDisable(false);
    }
  }, [name, email]);
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          "isOnboardingComplete",
          JSON.stringify(buttonDisable)
        );
      } catch (e) {
        Alert.alert(e);
      }
    })();
  }, [buttonDisable]);

  return (
    <View style={styles.container}>
      <View style={styles.logo_container}>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
        ></Image>
      </View>
      <View style={styles.form}>
        <Text style={styles.text}>Let us get to know you</Text>
        <Text style={{ marginBottom: "2%", fontSize: 20 }}>First Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          textContentType="emailAddress"
          style={styles.input}
          placeholder="name"
        />
        <Text style={{ marginBottom: "2%", fontSize: 20 }}>Email+{name}</Text>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={setEmail}
          placeholder="email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.button_container}>
        <View
          style={[
            styles.button,
            buttonDisable ? { backgroundColor: "yellow" } : "",
          ]}
        >
          <Text
            style={[
              styles.button_text,
              buttonDisable ? { color: "black" } : "",
            ]}
          >
            Next
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo_container: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "95%",
    height: "50%",
    resizeMode: "contain",
    marginTop: "10%",
  },
  form: {
    flex: 0.65,
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    marginTop: "10%",
    marginBottom: "25%",
    color: "grey",
  },
  input: {
    width: "80%",
    height: "10%",
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: "15%",
    paddingHorizontal: 10,
  },
  button_container: {
    flex: 0.2,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginLeft: "55%",
    borderWidth: 1,
    width: "25%",
    height: "30%",
    backgroundColor: "black",
  },
  button_text: {
    color: "white",
  },
});
export default Onboarding;
