import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ShowIcon from "../../assets/svg/Show";
import HideIcon from "../../assets/svg/Hide";

const InputProperty = (props) => {
  const {
    placeholder,
    title,
    type,
    valueName,
    value,
    options,
    handleInputChange,
    keyboardType,
    testId = "input",
  } = props;
  const [secureText, setSecureText] = useState(
    type === "password" || type === "confirmPassword"
  );
  const [showToggleIcon, setShowToggleIcon] = useState(
    type === "password" || type === "confirmPassword"
  );

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={options}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={(value) => handleInputChange(valueName, value)}
          />
        );
      case "textarea":
        return (
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder={placeholder}
            placeholderTextColor="#A1A1A1"
            value={value}
            testId={testId}
            keyboardType={keyboardType || "default"}
            multiline={true}
            numberOfLines={14}
            onChangeText={(value) => {
              handleInputChange(valueName, value);
            }}
          />
        );
      default:
        let keyboardType = "default";

        if (type === "tel") keyboardType = "phone-pad";
        if (type === "email") keyboardType = "email-address";
        if (type === "number") keyboardType = "numeric";

        return (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#A1A1A1"
              keyboardType={keyboardType}
              testId={testId}
              secureTextEntry={secureText}
              value={value}
              onChangeText={(value) => handleInputChange(valueName, value)}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {renderInput()}
        </View>
        <Pressable onPress={() => setSecureText(!secureText)}>
          {showToggleIcon && (secureText ? <ShowIcon /> : <HideIcon />)}
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#A1A1A1",
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  title: {
    color: "#808080",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 4,
  },
  input: {
    color: "#3E3E3E",
    fontSize: 14,
    padding: 0,
    margin: 0,
    textAlignVertical: "center",
    lineHeight: 17,
    flex: 1,
  },
  dropdown: {
    justifyContent: "center",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#A1A1A1",
    paddingVertical: 0,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#3E3E3E",
    paddingVertical: 0,
  },
  textarea: {
    height: 240,
    textAlignVertical: "top",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default InputProperty;
