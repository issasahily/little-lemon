import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  SectionList,
  SafeAreaView,
  StatusBar,
  Alert,
  Pressable,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
  deleteTable,
} from "../database";
import Filters from "../assets/Component/Filters";
import { getSectionListData, useUpdateEffect } from "../utils";
import SvgComponent from "../assets/SVG/Svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
const API_URL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const sections = ["starters", "mains", "desserts"];

const Item = ({ name, price, description, image }) => {
  const [presss, setPress] = useState(false);
  return (
    <View style={{ borderBottomWidth: 0.4 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          // borderWidth: 1,
        }}
      >
        <View>
          <Pressable onPress={() => setPress(!presss)}>
            <Text
              style={{
                width: 250,
                fontSize: 18,
                color: "#495E57",
              }}
              numberOfLines={presss ? 6 : 2}
            >
              {description}
            </Text>
          </Pressable>

          <Text
            style={{
              lineHeight: 40,
              fontWeight: "bold",
              fontSize: 20,
              color: "#495E57",
            }}
          >
            ${price}
          </Text>
        </View>
        <View>
          <Image
            source={{
              uri: `https://github.com/issasahily/little-lemon/blob/main/assets/image/${image}?raw=true`,
            }}
            style={{
              width: 100,
              height: 80,
              resizeMode: "cover",
              borderRadius: 15,
            }}
          />
        </View>
      </View>
    </View>
  );
};
var Primary = "#495E57";
var Primary2 = "#F4CE14";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fontsLoaded] = Font.useFonts({
    Karla: require("../assets/font/Karla-Regular.ttf"),
  });
  const [fontsKarla] = Font.useFonts({
    MarkaziText: require("../assets/font/MarkaziText-Regular.ttf"),
  });
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const my_data = await response.json();
      let i = 0;
      const result = my_data.menu.map((e) => {
        return {
          id: i++,
          name: e.name,
          price: e.price,
          category: e.category,
          description: e.description,
          image: e.image,
        };
      });
      //   console.log(result);
      return result;
    } catch (e) {
      Alert.alert(e);
    }
    // 1. Implement this function

    // const result=my_data.menu.reduce((accummaltor,currentvalue)=>{
    //   let data_group=accummaltor.find((e)=>e.title===currentvalue.category.title)
    //   if(!data_group){
    //       data_group={title:currentvalue.category.title,data:[]}
    //        accummaltor.push(data_group);
    //   }
    //   data_group.data.push({id:currentvalue.id,price:currentvalue.price,title:currentvalue.category.title});
    //   return accummaltor;
    // },[])

    // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
    // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
    // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
    // return array;
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        const initialState = await AsyncStorage.multiGet([
          "name",
          "lastname",
          "image",
        ]);
        // console.log(data);
        setImage(initialState.image ? JSON.parse(initialState.image) : "");
        setName(initialState.name ? initialState.name : "");
        setLastName(initialState.lastname ? initialState.lastname : "");
        await Font.loadAsync({
          Karla: require("../assets/font/Karla-Regular.ttf"),
        });
        await Font.loadAsync({
          MarkaziText: require("../assets/font/MarkaziText-Regular.ttf"),
        });
        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        if (!menuItems.length) {
          //  const  menuItems = await fetchData(); Error Big Error!!!!!????/
          console.log("fetch");
          menuItems = await fetchData();
          console.log(menuItems);

          saveMenuItems(menuItems);
        }

        // const sectionListData = getSectionListData(menuItems);

        setData(menuItems);
        console.log(menuItems);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        // const sectionListData = getSectionListData(menuItems);
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo((text) => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && fontsKarla) {
    }
  }, [fontsLoaded, fontsKarla]);

  if (!fontsLoaded) {
    return null;
  }
  if (!fontsKarla) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo_container} onLayout={onLayoutRootView}>
        <Image
          style={styles.logo}
          source={require("../assets/Logo.png")}
        ></Image>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: "#51E6CB",
            marginRight: "4%",
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
        </View>
      </View>

      <View style={{ backgroundColor: Primary }}>
        <Text
          style={{
            color: Primary2,
            fontSize: 70,
            fontFamily: "MarkaziText",
            height: 60,
            lineHeight: 70,
          }}
        >
          Little Lemon
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 50,
                fontFamily: "MarkaziText",
                lineHeight: 50,
              }}
            >
              Chicago
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                width: 190,
              }}
              allowFontScaling={true}
            >
              We are family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>

          <Image
            source={require("../assets/Hero2.png")}
            style={{
              width: 170,
              height: 180,
              resizeMode: "contain",
              borderRadius: 20,
            }}
          ></Image>
        </View>
        <Searchbar
          placeholder=""
          placeholderTextColor="white"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="white"
          inputStyle={{ color: "white" }}
          elevation={0}
        />
      </View>
      <Text style={{ fontSize: 20, fontWeight: "bold", lineHeight: 30 }}>
        ORDER FOR DELIVERY!
      </Text>

      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <FlatList
        style={styles.sectionList}
        data={data}
        keyExtractor={(item) => item.uuid}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginBottom: 24,
    backgroundColor: "#495E57",
    shadowRadius: 20,
    shadowOpacity: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#FBDABB",
    backgroundColor: "#495E57",
  },
  title: {
    fontSize: 20,
  },
  logo_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "1%",
  },
  logo: {
    width: 179,
    height: 56,
    resizeMode: "contain",
    alignSelf: "center",
    marginLeft: "27%",
  },
});
