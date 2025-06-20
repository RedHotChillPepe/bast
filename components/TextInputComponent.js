import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const TextInputComponent = (props) => {
  return (
    <View style={props.viewStyle}>
      <Text style={props.textStyle}>{props.text}</Text>
      <TextInput
        keyboardType={props.keyboardType || "default"}
        style={props.inputStyle}
        placeholder={props.placeholder}
        value={props.value ? String(props.value) : ''}
        onChangeText={(value) => {
          props.handleInputChange(props.valueName, value);
        }}
      />
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({});
