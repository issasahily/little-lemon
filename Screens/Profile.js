import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback } from "react";
import { Alert } from "react-native";
import SvgComponent from "../assets/SVG/Svg";
import ProfileSvg from "../assets/SVG/ProfileSvg";
import { useFonts } from "expo-font";
import Button from "../assets/Component/Button";
import { Checkbox, Modal, Portal, PaperProvider } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
var Primary = "#495E57";

const Profile = ({ navigation }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [valid, setValid] = useState(null);
  const [checked, setChecked] = useState({
    order: false,
    password: false,
    offer: false,
    newsletter: false,
  });
  const [image, setImage] = useState(null);
  const [render, setRender] = useState(true);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const saveChange = async () => {
    const keyValues = Object.entries(checked).map((entry) => {
      return [entry[0], String(entry[1])];
    });
    try {
      await AsyncStorage.multiSet([
        ["name", name],
        ["lastname", lastName],
        ["email", email],
        ["phone", phone],
        ["image", JSON.stringify(image)],
        keyValues[0],
        keyValues[1],
        keyValues[2],
        keyValues[3],
      ]);
    } catch (e) {
      Alert.alert(`An error occurred: ${e.message}`);
    } finally {
      Alert.alert("Saved Success .");
    }
  };
  const validPhone = () => {
    if (phone.trim().length == 10) {
      setValid(true);
    } else {
      setValid(false);
    }
  };

  const [fontsLoaded] = useFonts({
    Karla: require("../assets/font/Karla-Regular.ttf"),
  });
  const [fontsKarla] = useFonts({
    MarkaziText: require("../assets/font/MarkaziText-Regular.ttf"),
  });
  useEffect(() => {
    (async () => {
      const com = await AsyncStorage.multiGet([
        "isOnboardingComplete",
        "name",
        "email",
        "lastname",
        "image",
        "phone",
        "order",
        "password",
        "offer",
        "newsletter",
      ]);
      const initialState = com.reduce((acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
      }, {});
      setName(initialState.name ? initialState.name : "");
      setEmail(initialState.email ? initialState.email : "");
      setLastName(initialState.lastname ? initialState.lastname : "");
      setPhone(initialState.phone ? initialState.phone : "");
      setImage(initialState.image ? JSON.parse(initialState.image) : "");
      setChecked({
        order: JSON.parse(initialState.order),
        offer: JSON.parse(initialState.offer),
        password: JSON.parse(initialState.password),
        newsletter: JSON.parse(initialState.newsletter),
      });
    })();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && fontsKarla) {
      console.log("font download success.");
    }
  }, [fontsLoaded, fontsKarla]);

  if (!fontsLoaded) {
    return null;
  }
  if (!fontsKarla) {
    return null;
  }

  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.multiRemove([
        "isOnboardingComplete",
        "name",
        "email",
        "lastname",
        "image",
        "phone",
        "order",
        "password",
        "offer",
        "newsletter",
      ]);

      navigation.navigate("onboarding");
    } catch (e) {
      Alert.alert(e);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logo_container}>
        <Pressable
          onPress={() => navigation.navigate("home")}
          style={{ width: 50, height: 50, alignSelf: "center" }}
        >
          <SvgComponent />
        </Pressable>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
        ></Image>
        <Pressable
          onPress={pickImage}
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: "#51E6CB",
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          ) : (
            <Text style={{ color: "white" }}>
              {name[0]}
              {lastName[0]}
            </Text>
          )}
        </Pressable>
      </View>
      <View style={styles.form} onLayout={onLayoutRootView}>
        <Text style={styles.text}>Personal information</Text>
        <Text style={[styles.text_Avatar, { fontSize: 20 }]}>Avatar</Text>
      </View>
      <View
        style={{
          // flex: 0.1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        {/* <ProfileSvg style={{ width: 90, height: 90 }} /> */}
        <Pressable
          onPress={pickImage}
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: 90,
            height: 90,
            borderRadius: 90,
            backgroundColor: "#51E6CB",
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              resizeMode="cover"
              style={{ width: 90, height: 90, borderRadius: 90 }}
            />
          ) : (
            <Text style={{ color: "white", fontSize: 35 }}>
              {name[0]}
              {lastName[0]}
            </Text>
          )}
        </Pressable>
        <Button func={pickImage} styl={styles.button_Avatar}>
          <Text style={{ fontSize: 16, color: "white" }}>Change</Text>
        </Button>
        <Button
          func={() => setImage(null)}
          styl={[styles.button_Avatar, { backgroundColor: "", borderWidth: 1 }]}
        >
          <Text style={{ fontSize: 16, color: Primary }}>Remove</Text>
        </Button>
      </View>
      <View style={{}}>
        <ImageBackground source={require("../assets/little-lemon-logo.png")}>
          <Text style={styles.text_Avatar}>First name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            textContentType="username"
            style={styles.input}
            placeholder="name"
          />
          <Text style={styles.text_Avatar}>Last name</Text>
          <TextInput
            value={lastName}
            style={styles.input}
            onChangeText={setLastName}
            placeholder="last name"
          />
          <Text style={styles.text_Avatar}>Email</Text>
          <TextInput
            value={email}
            style={styles.input}
            onChangeText={setEmail}
            placeholder="email"
            keyboardType="email-address"
          />
          <Text style={styles.text_Avatar}>
            Phone number{" "}
            <Text style={{ color: "red", fontSize: 15 }}>
              {!valid && phone.length > 0 ? "(enter valid number!)" : ""}
            </Text>
          </Text>
          <TextInput
            value={phone}
            style={styles.input}
            onChangeText={(e) => {
              setPhone(e), validPhone();
            }}
            placeholder="+1*****"
            keyboardType="phone-pad"
            // onBlur={validPhone}
          />
          <Text style={[styles.text_Avatar, { fontSize: 24 }]}>
            Email notifications
          </Text>
        </ImageBackground>
      </View>

      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            marginLeft: 35,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Checkbox
            status={checked.order ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(() => ({
                ...checked,
                order: !checked.order,
              }));
            }}
            style={{ marginHorizontal: 0 }}
          />
          <Text> Order statuses</Text>
        </View>
        <View
          style={{
            marginLeft: 35,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            status={checked.password ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(() => ({
                ...checked,
                password: !checked.password,
              }));
            }}
          />
          <Text> Password Changes</Text>
        </View>
        <View
          style={{
            marginLeft: 35,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            status={checked.offer ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(() => ({
                ...checked,
                offer: !checked.offer,
              }));
            }}
          />
          <Text>Special offers</Text>
        </View>
        <View
          style={{
            marginLeft: 35,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox
            status={checked.newsletter ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(() => ({
                ...checked,
                newsletter: !checked.newsletter,
              }));
            }}
          />
          <Text> Newsletter</Text>
        </View>
      </View>
      <Button
        func={onLogoutHandler}
        styl={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          width: "90%",
          height: 40,
          borderRadius: 20,
          backgroundColor: "#F4CE14",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Log Out</Text>
      </Button>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 25,
          justifyContent: "space-between",
          marginVertical: 5,
        }}
      >
        <Button
          func={() => Alert.alert("hello")}
          styl={{
            justifyContent: "center",
            alignItems: "center",
            width: "40%",
            height: 35,
            borderRadius: 5,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 13 }}>Discard changes</Text>
        </Button>
        <Button
          func={saveChange}
          styl={{
            justifyContent: "center",
            alignItems: "center",
            width: "40%",
            height: 35,
            borderRadius: 5,
            backgroundColor: Primary,
          }}
        >
          <Text style={{ fontSize: 13, color: "white" }}>Saves changes</Text>
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "grey",
  },
  logo_container: {
    // flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "4%",
  },
  logo: {
    width: 179,
    height: 56,
    resizeMode: "contain",
    alignSelf: "center",
  },
  form: {
    // flex: 0.075,
  },
  text: {
    fontSize: 24,
    marginLeft: 10,
    fontFamily: "Karla",
  },
  text_Avatar: {
    fontFamily: "MarkaziText",
    fontSize: 25,
    marginLeft: 35,
  },
  input: {
    width: "85%",
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginLeft: 40,
  },
  button_container: {
    // flex: 0.2,
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
    width: 106,
    height: 54,
    backgroundColor: "black",
  },
  button_text: {
    color: "white",
  },
  button_Avatar: {
    width: 100,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Primary,
  },
});

export default Profile;
