import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApi } from "../context/ApiContext";
import ChevronLeft from "../assets/svg/ChevronLeft";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function ConfirmationPage({ navigation, route }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [sendError, setSendError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const { sendSms, verifySms, checkSmsCode } = useApi();
  const { setIsDeleted } = useAuth();

  const {
    regData,
    isResetPassword = false,
    isRegister = false,
    isDelete = false,
  } = route.params;
  const [tempToken, setTempToken] = useState("");

  useEffect(() => {
    handleSendCall();
  }, []);

  useEffect(() => {
    if (!canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [canResend]);

  const handleInputChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    } else if (text && index === 3) {
      Keyboard.dismiss(); // ← закрываем клавиатуру
    } else if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleConfirm = async () => {
    const confirmationCode = code.join("");
    try {
      const result = await verifySms(
        regData.phoneNumber,
        confirmationCode,
        tempToken
      );
      console.log(result);
      if (isRegister) {
        navigation.navigate("PersonalData", {
          regData,
          token: result.tempToken,
        });
      } else if (isResetPassword)
        navigation.navigate("ResetPassword", {
          regData,
          token: result.tempToken,
        });
      else if (isDelete) {
        setIsDeleted(true);
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage("");
      setSendError(
        error.message || "Произошла ошибка при подтверждении. Попробуйте позже."
      );
    }
  };

  const handleSendCall = async () => {
    setSendError("");
    setCanResend(false);
    try {
      let purpose = "";
      if (isResetPassword) purpose = "reset_password";
      else if (isRegister) purpose = "register";
      else if (isDelete) purpose = "delete_profile";
      const result = await sendSms(regData.phoneNumber, purpose);
      const json = await result.json();

      if (result.status === 201) {
        console.log(json);
        setTempToken(json.tempToken);
        setSuccessMessage("Код отправлен. Введите последние 4 цифры номера.");
      } else {
        const msg =
          json?.message || "Не удалось отправить код. Попробуйте позже.";
        setSendError(msg);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      setSuccessMessage("");
      setSendError(
        "Ошибка подключения. Проверьте интернет и попробуйте снова."
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.header__title}>
          {isDelete
            ? "Удаление аккаунта"
            : isResetPassword
            ? "Сброс пароля"
            : isRegister
            ? "Регистрация"
            : "Подтверждение номера"}
        </Text>
        <View />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.container}>
        {renderHeader()}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.title}>Подтверждение номера телефона</Text>
          <Text style={styles.text}>
            Введите последние 4 цифры входящего номера
          </Text>
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {code.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleInputChange(text, index)}
                />
              ))}
            </View>
          </View>
          {sendError.length > 0 && (
            <Text style={styles.errorText}>{sendError}</Text>
          )}
          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}
          <Pressable
            style={[styles.resendButton, { opacity: canResend ? 1 : 0.5 }]}
            disabled={!canResend}
            onPress={handleSendCall}
          >
            <Text style={styles.resendText}>
              {canResend
                ? "Отправить код повторно"
                : `Повторная отправка через ${timer} сек.`}
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          style={[styles.button, { opacity: code.includes("") ? 0.5 : 1 }]}
          onPress={handleConfirm}
          disabled={code.includes("")}
        >
          <Text style={styles.buttonText}>Далее</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#E5E5EA",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#3E3E3E",
    fontFamily: "Sora700",
    letterSpacing: -0.48,
    lineHeight: 20.17,
    color: "#3E3E3E",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  header__title: {
    color: "#3E3E3E",
    fontSize: 20,
    fontFamily: "Sora700",
    fontWeight: 600,
    lineHeight: 25.2,
    letterSpacing: -0.6,
  },
  text: {
    fontSize: 14,
    color: "#3E3E3E",
    fontWeight: "400",
    textAlign: "center",
    color: "#3E3E3E",
    fontFamily: "Sora400",
    letterSpacing: -0.42,
    lineHeight: 17.65,
  },
  button: {
    backgroundColor: "#2C88EC",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 44,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#F2F2F7",
    fontFamily: "Sora700",
    letterSpacing: -0.48,
    lineHeight: 20.17,
  },
  resendButton: {
    marginBottom: 12,
  },
  resendText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#3E3E3E",
    fontFamily: "Sora400",
    letterSpacing: -0.36,
    lineHeight: 16,
  },
  inputContainer: {
    marginTop: 48,
    marginBottom: 12,
  },
  input: {
    width: 54,
    height: 54,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#A1A1A1",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    // marginBottom: 8
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginBottom: 8,
  },
});
