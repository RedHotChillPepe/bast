import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';

export default function ConfirmChangePhonePage({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const [isShowSend, setIsShowSend] = useState(true)
  const [isCodeLabelShow, setIsCodeLabelShow] = useState(false)

  const { changePhone, verifySms, updateUser } = useApi()
  const { setAuth, getAuth } = useAuth()

  const { regData } = route.params


  const handleInputChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus(); // Переход к следующему полю
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1].focus(); // Переход к предыдущему полю при удалении
    }
  };

  const handleConfirm = async () => {
    const confirmationCode = code.join('');
    console.log("Confirmation code:", confirmationCode);
// [ ]
    const result = await verifySms(regData.phoneNumber, confirmationCode)
    const resultJson = JSON.parse([await result.text()])
    console.log(result);

    console.log(await resultJson);


    if (await result.status == 200) {
      console.log(await resultJson);

      if (await resultJson.result) {

        let result = await updateUser(regData.userObjectt).then(navigation.navigate("Profile"))
        const auth = JSON.parse(await getAuth())
        let status = await setAuth([{
          status: true,
          onboarded: false,
          phone: regData.userObjectt.phoneNumber,
          password: auth.password,
          usertype: regData.userObjectt.usertype
        }])

        if (await result.status == 200) {
          Alert.alert("Сообщение", "Изменения прошли успешно")
        } else {
          Alert.alert("Ошибка", `Код ошибки: ${result.status}`)
        }

      } else {
        setIsCodeLabelShow(true)
      }
    }
  };

  const handleSendCall = async () => {

    const result = await changePhone(regData.userObjectt.phoneNumber, regData.userObjectt.id, regData.userObjectt.usertype)
    if (await result.status == 200) {
      setIsShowSend(false)
    }

    console.log(result);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Подтверждение номера телефона</Text>
      <Text style={styles.text}>Вам поступит входящий звонок, введите последние 4 цифры номера телефона</Text>

      <View style={styles.inputContainer}>
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
      {
        isCodeLabelShow
        &&
        <Text style={styles.inputLabel}>
          Набран неверный код
        </Text>
      }

      {
        isShowSend
          ?
          <View>
            <Pressable style={styles.button} onPress={handleSendCall}>
              <Text style={styles.buttonText}>
                Отправить Код
              </Text>
            </Pressable>
          </View>
          :
          <View>
            <Pressable style={[styles.button, { opacity: code.includes('') ? 0.5 : 1 }]}
              onPress={handleConfirm}
              disabled={code.includes('')}>
              <Text style={styles.buttonText}>Подтвердить Код</Text>
            </Pressable>

          </View>
      }




      {/* временная кнопка для перехода на главную страницу */}
      <Pressable>
        <Text>

        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 36,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 8,
  },
  inputLabel: {
    color: "red"
  }
});
