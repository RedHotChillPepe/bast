import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';

const { width } = Dimensions.get('window');

const RegisterPage = () => {
  const { getUser } = useApi();
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prevPhone, setPrevPhone] = useState("");
  const [password, setPassword] = useState('');
  const [doublePass, setDoublePass] = useState('');

  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageRetryPassword, setErrorMessageRetryPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureDoubleText, setSecureDoubleText] = useState(true);

  const [isPhoneLabelShown, setIsPhoneLabelShown] = useState(false);
  const [isUserExistsLabelShown, setIsUserExistsLabelShown] = useState(false);

  const formatPhoneNumber = (text, previousText) => {
    if (!text) return "";
    setIsPhoneLabelShown(text.length !== 18);
    if (previousText && previousText.length > text.length) return text;
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
      cleaned = "7" + cleaned.slice(1);
    } else {
      cleaned = "7" + cleaned;
    }
    cleaned = cleaned.slice(0, 11);
    if (cleaned.length <= 1) {
      return "+7";
    } else if (cleaned.length <= 4) {
      return `+7 (${cleaned.slice(1)}`;
    } else if (cleaned.length <= 7) {
      const match = cleaned.match(/7(\d{3})(\d{0,3})/);
      if (match) return `+7 (${match[1]}) ${match[2]}`;
    } else if (cleaned.length <= 9) {
      const match = cleaned.match(/7(\d{3})(\d{3})(\d{0,2})/);
      if (match) return `+7 (${match[1]}) ${match[2]}-${match[3]}`;
    } else {
      const match = cleaned.match(/7(\d{3})(\d{3})(\d{2})(\d{0,2})/);
      if (match) return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }

    return text;
  };

  const handleChangePhone = (text) => {
    const formatted = formatPhoneNumber(text, prevPhone);
    setPhoneNumber(formatted);
    setPrevPhone(formatted);
  };

  // Разрешённые символы: ASCII от 33 (!) до 126 (~)
  const allowedRegex = /^[\x21-\x7E]*$/;
  const handlePasswordChange = (text) => {
    if (!allowedRegex.test(text)) {
      setErrorMessage("Введён недопустимый символ");
      return;
    }

    setPassword(text);
    setErrorMessage(text.length > 0 && text.length < 6 ? "Пароль должен содержать минимум 6 символов" : "");

    if (doublePass !== text) {
      setErrorMessageRetryPassword("Пароли не совпадают");
      return
    }

    setErrorMessageRetryPassword("");
  };

  const handleDoublePassChange = (text) => {
    setDoublePass(text);
    if (password !== text) {
      setErrorMessageRetryPassword("Пароли не совпадают");
      return;
    }
    setErrorMessageRetryPassword("");
  };

  const handleSubmit = async () => {
    const phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g;

    let isCorrect = (errorMessage.length == 0 && !isPhoneLabelShown && errorMessageRetryPassword.length == 0);
    if (!phonePattern.test(phoneNumber)) {
      setIsPhoneLabelShown(true);
      isCorrect = false;
    }

    if (!password) {
      setErrorMessage("Необходимо указать пароль");
      isCorrect = false;
    }

    if (!doublePass) {
      setErrorMessageRetryPassword("Необходимо повторить пароль");
      isCorrect = false;
    }

    if (!isCorrect) return;

    const normalPhoneNumber = normalizePhoneNumber(phoneNumber);

    const result = await getUser(normalPhoneNumber);
    const resultJson = JSON.parse([await result.text()]);
    if (await result.status == 200) {
      if (resultJson.result) {
        setIsUserExistsLabelShown(true);
        return;
      }

      navigation.navigate("ConfirmationPage", {
        regData: {
          phoneNumber: normalPhoneNumber,
          password: password
        }
      });
    }
  };

  const normalizePhoneNumber = (text) => {
    if (!text) return "";
    // Убираем все нецифровые символы
    let cleaned = text.replace(/\D/g, "");

    // Если номер начинается с "7", заменяем на "8", иначе добавляем "8" в начале
    if (cleaned.startsWith("7")) {
      cleaned = "8" + cleaned.slice(1);
    } else {
      cleaned = "8" + cleaned;
    }

    // Если цифр больше 11, обрезаем до 11
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }

    // Возвращаем в формате 89999999999
    return cleaned;
  };

  const handleChangeShowSecureText = () => {
    setSecureDoubleText(!secureText);
    setSecureText(!secureText);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Телефон:</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="+7 (912) 444-22-11"
            keyboardType='phone-pad'
            value={phoneNumber}
            maxLength={18}
            onChangeText={text => handleChangePhone(text)}
            placeholderTextColor="rgba(60,60,67,0.6)"
            fontSize={17}
          />
        </View>
        {isPhoneLabelShown && (
          <Text style={styles.inputLabel}>Неверный номер телефона</Text>
        )}
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Пароль:</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry={secureText}
            value={password}
            onChangeText={(text) => handlePasswordChange(text)}
            maxLength={20}
            placeholderTextColor="rgba(60,60,67,0.6)"
            fontSize={17}
          />
          <Pressable
            style={styles.iconContainer}
            onPress={handleChangeShowSecureText}
          >
            <AntDesign name={secureText ? "eyeo" : "eye"} size={20} color="gray" />
          </Pressable>
        </View>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Подтвердите пароль:</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Повтор пароля"
            secureTextEntry={secureDoubleText}
            value={doublePass}
            onChangeText={text => handleDoublePassChange(text)}
            maxLength={20}
            placeholderTextColor="rgba(60,60,67,0.6)"
            fontSize={17}
          />
        </View>
        {errorMessageRetryPassword ? (
          <Text style={styles.errorText}>{errorMessageRetryPassword}</Text>
        ) : null}
      </View>

      <Pressable
        style={styles.submitButton}
        onPress={() => handleSubmit()}
      >
        <Text style={styles.submitButtonText}>
          Подтвердить
        </Text>
      </Pressable>

      {isUserExistsLabelShown && (
        <Text style={styles.inputLabel}>Этот номер телефона уже зарегистрирован</Text>
      )}
    </SafeAreaView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    color: "red",
    fontSize: 14,
  },
  block: {
    width: width * 0.6,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: 'rgba(120,120,128,0.12)',
    height: 40,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  iconContainer: {
    padding: 8,
  },
  title: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 7,
    fontSize: 17,
  },
  inputLabel: {
    color: "red",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 32,
  },
  submitButtonText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    color: 'white',
  },
});
