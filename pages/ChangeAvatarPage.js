import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AvatarModal from '../components/AvatarModal';
import { useApi } from '../context/ApiContext';

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

  useEffect(() => {
    const init = async () => {

      if (Object.keys(userObject).length != 0) {
        setUser(userObject)
        setName(userObject.name)
        setSurname(userObject.surname)
        setEmail(userObject.email)
        setPhone(formatPhoneNumber(userObject.phone))
        setAvatar(userObject.photo)
      }

    };
    init();
  }, []);

  useEffect(() => { setIsCorrect(!isEmailLabelShown && !isPhoneLabelShown) }, [isEmailLabelShown, isPhoneLabelShown]);

  const formatPhoneNumber = (text, previousText) => {
    if (!text) return "";
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

    // Обрезаем пробелы и приводим к нижнему регистру
    let formatted = text.trim().toLowerCase();

    // Удаляем все символы, не входящие в разрешённый набор:
    // Разрешены: буквы a-z, цифры 0-9, символы @, ., _ , - и +
    formatted = formatted.replace(/[^a-z0-9@._+-]/g, "");

    // Если встречается более одного символа "@", оставляем только первый
    const firstAtIndex = formatted.indexOf("@");
    if (firstAtIndex !== -1)
      formatted =
        formatted.slice(0, firstAtIndex + 1) +
        formatted.slice(firstAtIndex + 1).replace(/@/g, "");

    return formatted;
  };

  const handleAvatarSelect = (newAvatarObject) => {
    console.log(newAvatarObject);

    setAvatar(newAvatarObject.uri);
    imageObject.current = newAvatarObject
    setModalVisible(false);
  };

  const normalizePhoneNumber = (text) => {
    if (!text) return "";
    // Убираем все нецифровые символы
    let cleaned = text.replace(/\D/g, "");

    // Если номер начинается с "7", заменяем на "8", иначе добавляем "8" в начале
    cleaned = cleaned.startsWith("7") ? `8${cleaned.slice(1)}` : `8${cleaned}`;

    // Если цифр больше 11, обрезаем до 11
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }

    // Возвращаем в формате 89999999999
    return cleaned;
  };

  // TODO: проверка, что номер был дейтсвительно изменен
  const handleSubmit = async () => {
    if (isCorrect && !prevPhone) return;

    let photo = null

    if (imageObject.current != undefined) {
      photo = { filename: imageObject.current.filename, base64: imageObject.current.base64 }
    }

    const newUserData = {
      id: userObject.id,
      usertype: usertype,
      phoneNumber: phone === "" ? userObject.phone : normalizePhoneNumber(phone),
      name: name === "" ? userObject.name : name,
      surname: surname === "" ? userObject.surname : surname,
      email: email === "" ? userObject.email : email,
      photo: photo
    }

    const sendAway = async () => {
      let result = await updateUser(newUserData).then(navigation.navigate("Profile"))

      if (await result.status == 200) Alert.alert("Сообщение", "Изменения прошли успешно")
      else Alert.alert("Ошибка", `Код ошибки: ${result.status}`)
    }

    if (phone === userObject.phone) {
      await sendAway()
      return;
    }

    navigation.navigate("ConfirmPhone", {
      regData: {
        phoneNumber: userObject.phone,
        userObjectt: newUserData
      }
    })

  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, styles.container]}>

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

        <View style={styles.block}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Имя:</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={user.name}
            value={name}
            onChangeText={(text) => setName(text)}
            maxLength={20}
            placeholderTextColor='rgba(60,60,67, 0.6'
            fontSize={17}
          />
        </View>

        {user.surname != undefined &&

          <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Фамилия:</Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder={user.surname}
              value={surname}
              onChangeText={(text) => setSurname(text)}
              maxLength={20}
              placeholderTextColor='rgba(60,60,67, 0.6'
              fontSize={17}
            />
          </View>
        }

        <View style={styles.block}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Почта:</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={user.email}
            value={email}
            onChangeText={handleChangeEmail}
            maxLength={50}
            placeholderTextColor='rgba(60,60,67, 0.6'
            fontSize={17}
          />
          {isEmailLabelShown && (
            <Text style={styles.inputLabel}>Введите корректный адрес электронной почты</Text>
          )}
        </View>

        <View style={styles.block}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Телефон:</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder={user.phone}
            value={phone}
            onChangeText={handleChangePhone}
            maxLength={18}
            placeholderTextColor='rgba(60,60,67, 0.6'
            fontSize={17}
          />
          {isPhoneLabelShown && (
            <Text style={styles.inputLabel}>Неверный номер телефона</Text>
          )}
        </View>

        <View style={{ paddingBottom: 124 }}>
          <Pressable
            disabled={!isCorrect}
            onPress={() => { handleSubmit() }}
            style={isCorrect ? styles.button : styles.disabledButton}>
            <Text style={isCorrect ? styles.buttonText : styles.disabledButtonText}>Сохранить изменения</Text>
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


