import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
            backgroundColor: selections[index] ? "#F4CE14" : "#D9D9D9",
            borderRadius: 15,
            marginHorizontal: 15,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "900",
                color: selections[index] ? "#495E57" : "#495E57",
              }}
            >
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderColor: "#D9D9D9",
  },
});

export default Filters;
