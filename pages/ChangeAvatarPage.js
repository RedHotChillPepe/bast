import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AvatarModal from '../components/AvatarModal';
import { useApi } from '../context/ApiContext';
import { useToast } from '../context/ToastProvider';
import { useLogger } from '../context/LoggerContext';

const { width } = Dimensions.get('window');

const ChangeAvatarPage = ({ route, navigation }) => {
  const { updateUser } = useApi()
  const { userObject, usertype } = route?.params
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const imageObject = useRef()
  const [modalVisible, setModalVisible] = useState(false);

  const [phone, setPhone] = useState("")
  const [prevPhone, setPrevPhone] = useState("");
  const [isPhoneLabelShown, setIsPhoneLabelShown] = useState(false);

  const [email, setEmail] = useState("")
  const [isEmailLabelShown, setIsEmailLabelShown] = useState(false);

  const [surname, setSurname] = useState("")
  const [name, setName] = useState("")

  const [isCorrect, setIsCorrect] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const showToast = useToast();
  const { logError } = useLogger();

  useEffect(() => {
    const init = async () => {

      if (Object.keys(userObject).length == 0) return;
      setUser(userObject)
      setName(userObject.name)
      setSurname(userObject.surname)
      setEmail(userObject.email)
      setPhone(formatPhoneNumber(userObject.phone))
      setAvatar(userObject.photo)

    };
    init();
  }, []);

  useEffect(() => {
    setIsCorrect(!isEmailLabelShown && !isPhoneLabelShown);
    checkIfDataChanged(); // ✅ Проверка изменений
  }, [isEmailLabelShown, isPhoneLabelShown, name, surname, phone, email, avatar]); // ✅ Добавлено

  const checkIfDataChanged = () => { // ✅ Добавлено
    const hasChanged =
      name !== userObject.name ||
      surname !== userObject.surname ||
      email !== userObject.email ||
      phone !== formatPhoneNumber(userObject.phone) ||
      avatar !== userObject.photo;

    setIsChanged(hasChanged);
  };

  const formatPhoneNumber = (text, previousText) => {
    if (!text) return "";
    // FIXME: баг ебанный, error не отображается
    setIsPhoneLabelShown(text.length !== 18 && previousText);
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

  const handleChangePhone = (text) => {
    const formatted = formatPhoneNumber(text, prevPhone);
    setPhone(formatted);
    setPrevPhone(formatted);
  };

  const handleChangeEmail = (text) => {
    const formatted = emailFormatting(text);
    setIsEmailLabelShown(!isEmailCorrect(formatted));
    setEmail(formatted);
  }

  const isEmailCorrect = (email) => {
    if (!email) return false;

    // Регулярное выражение:
    // 1. Локальная часть: от одного и более символов из a-z, цифр и допустимых спецсимволов (._+-)
    // 2. Затем символ "@"
    // 3. Затем доменная часть: от одного и более символов из a-z, цифр или дефиса
    // 4. Затем точка "."
    // 5. Затем доменное расширение: минимум 2 буквы
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };

  const emailFormatting = (text) => {
    if (!text) return "";

    let formatted = text.trim().toLowerCase();
    formatted = formatted.replace(/[^a-z0-9@._+-]/g, "");

    const firstAtIndex = formatted.indexOf("@");
    if (firstAtIndex !== -1)
      return formatted.slice(0, firstAtIndex + 1) +
        formatted.slice(firstAtIndex + 1).replace(/@/g, "");

    return formatted;
  };

  const handleAvatarSelect = (newAvatarObject) => {
    setAvatar(newAvatarObject.uri);
    imageObject.current = newAvatarObject
    setModalVisible(false);
  };

  const normalizePhoneNumber = (text) => {
    if (!text) return "";
    let cleaned = text.replace(/\D/g, "");
    cleaned = cleaned.startsWith("7") ? `8${cleaned.slice(1)}` : `8${cleaned}`;
    if (cleaned.length > 11) return cleaned.slice(0, 11);
    return cleaned;
  };

  // TODO: добавить подтверждение смены номера телефона
  const handleSubmit = async () => {
    if (!isCorrect || !isChanged) return;

    const photo = imageObject.current
      ? { filename: imageObject.current.filename, base64: imageObject.current.base64 }
      : null;

    // Изначально формируем объект с данными пользователя
    let newUserData = {
      id: userObject.id,
      // usertype,
      phone: phone === "" ? userObject.phone : normalizePhoneNumber(phone),
      name: name === "" ? userObject.name : name,
      surname: surname === "" ? userObject.surname : surname,
      email: email === "" ? userObject.email : email,
      photo,
    };
    try {
      const result = await updateUser(newUserData);
      const resultData = result.json ? await result.json() : result;
      // Если сервер вернул обновлённое фото, обновляем объект newUserData
      if (resultData.photo) {
        newUserData = { ...newUserData, photo: resultData.photo };
      }

      if (result.status === 200) {
        showToast("Изменения прошли успешно");
        navigation.navigate("Profile", { updatedUser: newUserData });
      } else {
        showToast(`Код ошибки: ${result.status}`, "error");
      }
    } catch (error) {
      logError(navigation.getState().routes[0].name, error, { newUserData, handleName: "handleSubmit" });
      showToast("Не удалось сохранить изменения.", "error");
    }
  };

  const renderAvatar = () => {
    return (
      <View>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <Text>Нет аватара</Text>
          )}
        </View>
        <View style={{ paddingBottom: 32 }}>
          <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Сменить аватар</Text>
          </Pressable>
        </View>
        <AvatarModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectAvatar={handleAvatarSelect}
        />
      </View>
    )
  }

  const listInputProperty = [
    {
      title: "Имя",
      placeholder: user.name,
      value: name,
      onChangeText: setName,
      errorLabel: "",
      isShowError: false,
      id: 1
    },
    {
      title: "Фамилия",
      placeholder: user.surname,
      value: surname,
      onChangeText: setSurname,
      errorLabel: "",
      isShowError: false,
      id: 2
    },
    {
      title: "Почта",
      placeholder: user.email,
      value: email,
      onChangeText: handleChangeEmail,
      errorLabel: "Введите корректный адрес электронной почты",
      isShowError: isEmailLabelShown,
      id: 3
    },
    {
      title: "Телефон",
      placeholder: user.phone,
      value: phone,
      onChangeText: handleChangePhone,
      errorLabel: "Неверный номер телефона",
      isShowError: isPhoneLabelShown,
      id: 4
    },
  ]

  const renderInputProperty = () => {
    return listInputProperty.map((input) => (
      <View key={input.id} style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{input.title}:</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={input.placeholder}
          value={input.value}
          onChangeText={input.onChangeText}
          maxLength={50}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
        />
        {
          input.isShowError && (
            <Text style={styles.inputLabel}>{input.errorLabel}</Text>
          )
        }
      </View>
    ))
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, styles.container]}>
        {renderAvatar()}
        {renderInputProperty()}
        <View style={{ paddingBottom: 124 }}>
          <Pressable
            disabled={!isCorrect || !isChanged}
            onPress={handleSubmit}
            style={isCorrect && isChanged ? styles.button : styles.disabledButton}>
            <Text style={isCorrect && isChanged ? styles.buttonText : styles.disabledButtonText}>
              Сохранить изменения
            </Text>
          </Pressable>
        </View>
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 16,
    backgroundColor: '#f7f7f7',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#2C88EC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#9DC0F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  block: {
    width: width - 72,
    marginBottom: 12
  },
  title: {
    marginBottom: 8
  },
  titleText: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(120,120,128, 0.12)',
    height: 40,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  inputLabel: {
    color: "red",
    marginTop: 4,
  },
});

export default ChangeAvatarPage;