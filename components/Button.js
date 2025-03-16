import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
const { width } = Dimensions.get("window");

const Button = (props) => {
  const { buttonHandle, title } = props;
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={buttonHandle}>
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "baseline",
  },
  button: {
    backgroundColor: "#2C88EC",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    padding: 8,
    textAlign: "center",
    fontWeight: "600",
    color: "white",
    fontSize: 14,
  },
});


export default Button;
