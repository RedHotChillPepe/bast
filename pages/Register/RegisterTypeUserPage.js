import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/svg/ChevronLeft";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import UniversalHeader from "../../components/UniversalHeaderComponent";
const RegisterTypeUserPage = () => {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(null);
  const { referralToken } = useAuth();
  console.log(referralToken);

  const selectorsList = [
    { label: "Физическое лицо", usertype: 1 },
    { label: "Юридическое лицо", usertype: 2 },
  ];

  const handleSelected = (item) => {
    setSelectedType(item);
  };

  const renderSelectors = () => {
    return (
      <View style={styles.selectors}>
        <Text>Выберите тип аккаунта</Text>
        <View style={styles.button__group}>
          {selectorsList.map((item) => (
            <TouchableOpacity
              key={`selector-${item.usertype}`}
              style={[
                styles.button,
                {
                  backgroundColor:
                    item.usertype == selectedType?.usertype
                      ? "#2C88EC"
                      : "#E5E5EA",
                },
              ]}
              onPress={() => handleSelected(item)}
            >
              <Text
                style={[
                  styles.button__text,
                  {
                    color:
                      item.usertype == selectedType?.usertype
                        ? "#F2F2F7"
                        : "#2C88EC",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleSubmit = () => {
    navigation.navigate("Register", { usertype: selectedType.usertype });
  };

  const renderSubmitButton = () => {
    return (
      <TouchableOpacity
        style={[styles.submitButton, { opacity: !selectedType ? 0.5 : 1 }]}
        onPress={() => handleSubmit()}
        disabled={!selectedType}
      >
        <Text style={styles.submitButtonText}>Далее</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
      <UniversalHeader title="Регистрация" typography={"title2"} />
      {renderSelectors()}
      {renderSubmitButton()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  selectors: {
    gap: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button__group: {
    rowGap: 16,
    alignSelf: "stretch",
  },
  button: {
    padding: 12,
    alignSelf: "stretch",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#2C88EC",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  button__text: {
    color: "#2C88EC",
    fontFamily: "Sora400",
    fontWeight: 400,
    lineHeight: 17.6,
    letterSpacing: -0.42,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 44,
  },
  submitButtonText: {
    fontSize: 16,
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontWeight: 600,
    fontFamily: "Sora700",
    color: "#F2F2F7",
  },
});

export default RegisterTypeUserPage;
