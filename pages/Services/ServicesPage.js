import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from "react-native";
import UniversalHeader from "../../components/UniversalHeaderComponent";
import { useApi } from "../../context/ApiContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastProvider";
import InputProperty from "./../../components/PostComponents/InputProperty";

const { width } = Dimensions.get("window");

const ServicesPage = ({ handleClose, selectedItem }) => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const showToast = useToast();
  const { createServiceRequest, getCurrentUser } = useApi();

  const [formData, setFormData] = useState({
    user_name: "",
    user_surname: "",
    user_phone: "",
    prevPhone: "",
    service_id: selectedItem.serviceId,
  });

  const [formErrors, setFormErrors] = useState({
    user_name: "",
    user_surname: "",
    user_phone: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const [isShowInputs, setIsShowInputs] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getCurrentUser();
        setFormData((prev) => ({
          ...prev,
          user_name: result.name ?? "",
          user_surname: result.surname ?? "",
          user_phone: formatPhoneNumber(result.phone) ?? "",
          prevPhone: result.phone ?? "",
        }));
      } catch (error) {
        navigation.navigate("Error");
      }
    };
    fetchUser();
  }, []);

  // Добавляем анимацию переключения страниц (сдвиг вправо)
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handlePageTransition = () => {
    Animated.timing(translateX, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(width);
      setIsShowInputs(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const listInputs = [
    { title: "Имя", valueName: "user_name", placeholder: "Иван", type: "" },
    {
      title: "Фамилия",
      valueName: "user_surname",
      placeholder: "Иванов",
      type: "",
    },
    {
      title: "Контактный телефон",
      valueName: "user_phone",
      placeholder: " + 7(XXX) XXX- XX - XX",
      type: "tel",
    },
  ];

  const formatPhoneNumber = (text) => {
    if (!text) return "";
    if (formData.prevPhone && formData.prevPhone.length > text.length)
      return text;
    let cleaned = text.replace(/\D/g, "");
    cleaned =
      cleaned.startsWith("7") || cleaned.startsWith("8")
        ? `7${cleaned.slice(1)}`
        : `7${cleaned}`;
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

  const handleChangePhone = (field, value) => {
    const formatted = formatPhoneNumber(value);
    setFormData((prevData) => ({
      ...prevData,
      [field]: formatted,
      prevPhone: formatted,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [field]:
        formatted.length === 18 ? "" : "Не верный формат номера телефона",
    }));
  };

  const validateNameOrSurname = (value) => {
    const regex = /^([А-Я]{1}[а-яё]{1,23}|[A-Z]{1}[a-z]{1,23})$/;
    return regex.test(value);
  };

  const handleInput = (field, value) => {
    let val = value.value || value;

    if (field === "user_phone") {
      handleChangePhone(field, val);
      return;
    }

    if (field === "user_name" || field === "user_surname") {
      // Удаляем всё, кроме букв русского и латинского алфавита
      val = val.replace(/[^A-Za-zА-Яа-яёЁ]/g, "");

      // Ограничим длину
      val = val.slice(0, 24);

      // Приводим к нужному регистру: первая буква заглавная, остальные строчные
      if (val.length > 0) {
        val = val[0].toUpperCase() + val.slice(1).toLowerCase();
      }

      const isValid = validateNameOrSurname(val.trim());
      setFormErrors((prev) => ({
        ...prev,
        [field]: isValid ? "" : "Минимум 2 буквы, только текст с заглавной",
      }));

      setFormData((prevData) => ({ ...prevData, [field]: val }));
      return;
    }

    // Обработка прочих полей
    setFormData((prevData) => ({ ...prevData, [field]: val }));
  };

  const renderInputs = () => {
    return (
      <Animated.View
        style={{ transform: [{ translateX }], marginTop: 19, gap: 16 }}
      >
        {isShowInputs ? (
          listInputs.map((item, index) => (
            <View
              key={index}
              style={[theme.spacing.small, { gap: theme.spacing.small }]}
            >
              <View style={{ flexDirection: "row" }}>
                <InputProperty
                  title={item.title}
                  placeholder={item.placeholder}
                  value={formData[item.valueName]}
                  valueName={item.valueName}
                  handleInputChange={handleInput}
                  type={item.type}
                />
              </View>
              {formErrors[item.valueName].length > 0 && (
                <Text
                  Text
                  style={[
                    theme.typography.regular("error"),
                    { textAlign: "left" },
                  ]}
                >
                  {formErrors[item.valueName]}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[theme.typography.regular(), { textAlign: "left" }]}>
            {selectedItem.subText}
            {"\n"}
            {"\n"}Чтобы подать заявку, оставьте свои контактные данные.
          </Text>
        )}
        {isShowInputs &&
          formErrors.message.length > 0 &&
          !successMessage.length && (
            <Text
              Text
              style={[theme.typography.regular("error"), { textAlign: "left" }]}
            >
              {formErrors.message}
            </Text>
          )}
        {isShowInputs && successMessage.length > 0 && (
          <Text
            style={[theme.typography.regular("success"), { textAlign: "left" }]}
          >
            {successMessage}
          </Text>
        )}
      </Animated.View>
    );
  };

  const hasFormErrors = () => {
    // Проверка ошибок валидации
    if (Object.values(formErrors).some((error) => error !== "")) {
      return true;
    }

    let result = false;

    // Проверка обязательных полей
    const requiredFields = {
      user_name: "Имя обязательное",
      user_surname: "Фамилия обязательная",
      user_phone: "Телефон обязателен",
    };

    for (const [field, errorMessage] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === "") {
        result = true;
      }
    }

    if (successMessage.length > 0) result = true;

    return result;
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

  const handleSubmit = async () => {
    if (!isShowInputs || hasFormErrors()) {
      handlePageTransition();
      return;
    }

    const normalPhoneNumber = normalizePhoneNumber(formData.user_phone);
    try {
      const result = await createServiceRequest({
        ...formData,
        user_phone: normalPhoneNumber,
      });
      if (!result.success) throw result;

      setSuccessMessage(result.message);
      // handleClose();
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        message: error.message || "Произошла ошибка, повторите попытку позже",
      }));
    }
  };

  const customHandleClose = () => {
    if (isShowInputs) {
      // Сдвигаем форму вправо
      Animated.timing(translateX, {
        toValue: width,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Ставим описание слева за экраном
        translateX.setValue(-width);
        setIsShowInputs(false);
        // Сдвигаем описание в центр
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Закрытие модалки, если уже на описании
      handleClose();
    }
  };

  return (
    <SafeAreaView style={theme.container}>
      <View style={Platform.OS !== "ios" ? { flex: 1 } : theme.container}>
        <UniversalHeader
          title={isShowInputs ? "Создание заявки" : selectedItem.title}
          handleClose={customHandleClose}
        />
        <View style={{ flex: 1, marginTop: 8 }}>
          <Text style={[theme.typography.title2, { textAlign: "left" }]}>
            {selectedItem.subTitle}
          </Text>
          {renderInputs()}
        </View>
        <TouchableOpacity
          style={[
            theme.buttons.classisButton,
            {
              marginBottom: 28,
              opacity: isShowInputs && hasFormErrors() ? 0.6 : 1,
            },
          ]}
          disabled={isShowInputs && hasFormErrors()}
          onPress={handleSubmit}
        >
          <Text style={theme.typography.buttonTextXL}>
            {isShowInputs ? "Отправить заявку" : "К заявке"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ServicesPage;
