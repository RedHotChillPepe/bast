import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChevronLeft from '../assets/svg/ChevronLeft';
import InputProperty from "../components/PostComponents/InputProperty";
import { useApi } from '../context/ApiContext';
import DocumentationScreen from './Register/DocumentationScreen';
import { useToast } from "../context/ToastProvider";

const { width } = Dimensions.get('window');

const RegisterPage = ({ route }) => {
  const { checkPhone, getDocument } = useApi();
  const showToast = useToast();

  const navigation = useNavigation();
  const [prevPhone, setPrevPhone] = useState("");

  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: "",
    usertype: route.params.usertype,
    isCheckPrivacy: false,
    isCheckTerm: false
  });

  const [formErrors, setFormErrors] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });


  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [isShowDocumentModal, setIsShowDocumentModal] = useState(false);

  const handleSelectedDocument = (item) => {
    setSelectedDocument(item);
    setIsShowDocumentModal(true);
  }

  const formatPhoneNumber = (text, previousText, field) => {
    if (!text) return "";
    if (previousText && previousText.length > text.length) return text;
    let cleaned = text.replace(/\D/g, "");
    cleaned = cleaned.startsWith("7") || cleaned.startsWith("8") ? `7${cleaned.slice(1)}` : `7${cleaned}`;
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

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const result = await getDocument();
        setDocuments(result);

      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    fetchDocuments();
  }, []);

  const handleChangePhone = (field, value) => {
    const formatted = formatPhoneNumber(value, prevPhone, field);
    setFormData((prevData) => ({ ...prevData, [field]: formatted }));
    setPrevPhone(formatted);
    setFormErrors((prev) => ({ ...prev, [field]: formatted.length === 18 ? "" : "Не верный формат номера телефона" }))
  };

  // Разрешённые символы: ASCII от 33 (!) до 126 (~)
  const allowedRegex = /^[\x21-\x7E]*$/;
  const handlePasswordChange = (field, value) => {
    if (!allowedRegex.test(value)) {
      setFormErrors((prev) => ({ ...prev, [field]: "Введён недопустимый символ" }));
      return;
    }

    setFormData((prevData) => {
      const newData = { ...prevData, [field]: value };
      const password = field === 'password' ? value : prevData.password;
      const confirmPassword = field === 'confirmPassword' ? value : prevData.confirmPassword;

      const newErrors = {
        password: password.length > 0 && password.length < 6
          ? "Пароль должен содержать минимум 6 символов"
          : password !== confirmPassword ? "Пароли не совпадают" : "",
        confirmPassword: password !== confirmPassword ? "Пароли не совпадают" : ""
      };

      setFormErrors(newErrors);
      return newData;
    });
  };

  const hasFormErrors = () => {
    // Проверка ошибок валидации
    if (Object.values(formErrors).some(error => error !== "")) {
      return true;
    }

    let result = false;

    // Проверка обязательных полей
    const requiredFields = {
      phoneNumber: "Телефон обязателен",
      password: "Пароль обязателен",
      confirmPassword: "Подтверждение пароля обязательно"
    };

    for (const [field, errorMessage] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === "") {
        // setFormErrors(prev => ({ ...prev, [field]: errorMessage }));
        result = true;
      }
    }

    return result;
  };

  const handleSubmit = async () => {
    // Проверка на ошибки
    if (hasFormErrors()) {
      showToast("Пожалуйста, исправьте ошибки в форме", "warn");
      return;
    }

    // Если ошибок нет, продолжаем обработку
    try {
      const normalPhoneNumber = normalizePhoneNumber(formData.phoneNumber);
      const result = await checkPhone(normalPhoneNumber);

      if (result.statusCode !== 200) {
        throw new Error(result.message);
      }

      navigation.navigate("ConfirmationPage", {
        regData: {
          phoneNumber: normalPhoneNumber,
          password: formData.password,
          usertype: formData.usertype
        }
      });
    } catch (error) {
      console.error(error);
      showToast(error.message || "Ошибка при регистрации");
    }
  };

  const normalizePhoneNumber = (text) => {
    if (!text) return "";
    // Убираем все нецифровые символы
    let cleaned = text.replace(/\D/g, "");

    // Если номер начинается с "7", заменяем на "8", иначе добавляем "8" в начале
    cleaned = cleaned.startsWith("7") ? `8${cleaned.slice(1)}` : `8${cleaned}`;

    // Если цифр больше 11, обрезаем до 11
    if (cleaned.length > 11) {
      return cleaned.slice(0, 11);
    }

    // Возвращаем в формате 89999999999
    return cleaned;
  };

  const inputList = [
    { label: "Телефон", placeholder: "+7 (ХХХ) ХХХ-ХХ-ХХ", valueName: "phoneNumber", type: "tel", error: formErrors.phoneNumber },
    { label: "Придумайте пароль", placeholder: "Пароль", valueName: "password", type: "password", error: formErrors.password },
    { label: "Подтвердите пароль", placeholder: "Подтвердите пароль", valueName: "confirmPassword", type: "confirmPassword", error: formErrors.confirmPassword },
  ]

  const handleInputChange = (field, value) => {
    switch (field) {
      case "phoneNumber":
        handleChangePhone(field, value);
        break;
      case "password":
        handlePasswordChange(field, value);
        break;
      case "confirmPassword":
        handlePasswordChange(field, value);
        break;
    }
  };

  const renderHeader = () => {
    return <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()}>
        <ChevronLeft />
      </Pressable>
      <Text style={styles.header__title}>Регистрация</Text>
      <View />
    </View >
  }

  const radioButton = (typeCheck) => {
    return <View style={{ columnGap: 12, flexDirection: "row", alignItems: "center", alignItems: "center", }}>
      <TouchableOpacity
        onPress={() => handleInputChange(typeCheck, !formData[typeCheck])}
        style={[styles.radio__button, { borderColor: formData[typeCheck] ? "#2C88EC" : "#A1A1A1" }]}
      >
        {formData[typeCheck] &&
          <View style={styles.radio__point}></View>
        }
      </TouchableOpacity>
      <View style={styles.radio__text__container}>
        <Text style={[styles.radio__text, { color: "#808080" }]}>Я прочитал и согласен с </Text>
        <TouchableOpacity>
          <Text style={[styles.radio__text, { color: "#2C88EC" }]}>политикой конфиденциальности</Text>
        </TouchableOpacity>
      </View>
    </View>
  }

  const renderDocuments = () => {
    if (isLoading) return <View style={{ marginTop: 40 }}><ActivityIndicator /></View>

    return <View style={{ marginTop: 40, alignSelf: "stretch" }}>
      <Text style={[styles.confirm__text, { color: "#808080" }]}>
        Нажимая «Далее», вы соглашаетесь с условиями следующих документов:&nbsp;
        {documents.map((item, index) => (
          <Text style={styles.confirm__text} key={`documents-${index}`}>
            <Text
              style={[styles.confirm__text, { color: '#2C88EC' }]}
              onPress={() => handleSelectedDocument(item)}
            >
              {item.title}
            </Text>
            {index === documents.length - 1 ? '.' : ', '}
          </Text>
        ))}
      </Text>
    </View>
  }

  const renderInput = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: 'stretch', marginHorizontal: 16, }}>
        <Text style={styles.titleText}>Данные пользователя</Text>
        <View style={styles.input__container}>
          {inputList.map((item, index) => (
            <View key={`input-${index}`}>
              <View View style={styles.row} >
                <InputProperty
                  title={item.label}
                  placeholder={item.placeholder}
                  value={formData[item.valueName]}
                  valueName={item.valueName}
                  type={item.type}
                  handleInputChange={handleInputChange}
                />
              </View>
              {item.error &&
                <Text style={styles.errorText}>{item.error}</Text>
              }
            </View>)
          )}
        </View>
        {/* <View style={{ rowGap: 16, marginTop: 40, alignSelf: "stretch" }}>
          {radioButton("isCheckPrivacy")}
          {radioButton("isCheckTerm")}
        </View> */}
        {renderDocuments()}
      </View >)
  }

  const renderSubmitButton = () => {
    return <TouchableOpacity
      style={[styles.submitButton, { opacity: hasFormErrors() ? 0.5 : 1 }]}
      onPress={() => handleSubmit()}
      disabled={hasFormErrors()}
    >
      <Text style={styles.submitButtonText}>
        Далее
      </Text>
    </TouchableOpacity>
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
      {renderHeader()}
      {renderInput()}
      {renderSubmitButton()}
      <Modal visible={isShowDocumentModal}><DocumentationScreen selectedDocument={selectedDocument} handleClose={() => setIsShowDocumentModal(false)} /></Modal>

    </SafeAreaView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    alignSelf: "stretch",
    marginHorizontal: 16
  },
  header__title: {
    color: "#3E3E3E",
    fontSize: 20,
    fontFamily: "Sora700",
    fontWeight: 600,
    lineHeight: 25.2,
    letterSpacing: -0.6,
  },

  errorText: {
    marginTop: 8,
    color: "red",
    fontSize: 14,
  },
  input__container: {
    gap: 24,
    alignSelf: "stretch",
  },
  row: {
    columnGap: 16,
    flexDirection: "row",
  },
  titleText: {
    fontSize: 16,
    color: "#3E3E3E",
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontWeight: 600,
    fontFamily: "Sora700",
    paddingBottom: 24,
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 7,
    fontSize: 17,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 44,
  },
  submitButtonText: {
    fontSize: 16,
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontWeight: 600,
    fontFamily: "Sora700",
    color: '#F2F2F7',
  },
  radio__button: {
    borderRadius: "50%",
    width: 14,
    height: 14,
    borderWidth: 1,
    padding: 2
  },
  radio__point: {
    borderRadius: "50%",
    backgroundColor: "#2C88EC",
    flex: 1
  },
  radio__text__container: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio__text: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
    letterSpacing: -0.36,
    fontFamily: "Sora400"
  },
  confirm__text: {
    flexWrap: 'wrap',
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
    letterSpacing: -0.36,
    fontFamily: "Sora400"
  }
});
