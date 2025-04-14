import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useApi } from '../context/ApiContext';

export default function ConfirmationPage({ navigation, route }) {
  const [code, setCode] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [sendError, setSendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);

  const { sendSms, verifySms } = useApi();
  const { regData } = route.params;

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

    if (text && index < 3) inputRefs.current[index + 1].focus();
    if (!text && index > 0) inputRefs.current[index - 1].focus();
  };

  const handleConfirm = async () => {
    const confirmationCode = code.join('');
    try {
      const result = await verifySms(regData.phoneNumber, confirmationCode);
      const resultJson = await result.json();

      if (result.status === 201) {
        if (result.ok) {
          navigation.navigate('PersonalData', { regData });
        } else {
          setSendError(resultJson.message || 'Неверный код');
        }
      } else {
        setSendError(resultJson.message || 'Ошибка проверки кода');
      }
    } catch (error) {
      console.error(error);
      setSendError('Произошла ошибка при подтверждении. Попробуйте позже.');
    }
  };

  const handleSendCall = async () => {
    setSendError('');
    setCanResend(false);
    try {
      const result = await sendSms(regData.phoneNumber);
      const json = await result.json();

      if (result.status === 201) {
        console.log(json);
        setSuccessMessage('Код отправлен. Введите последние 4 цифры номера.');
      } else {
        const msg = json?.message || 'Не удалось отправить код. Попробуйте позже.';
        setSendError(msg);
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      setSendError('Ошибка подключения. Проверьте интернет и попробуйте снова.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>Подтверждение номера телефона</Text>
      <Text style={styles.text}>Введите последние 4 цифры входящего номера</Text>
      <View style={styles.inputContainer}>
        <View style={{ flexDirection: 'row' }}>
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
      {sendError.length > 0 && <Text style={styles.errorText}>{sendError}</Text>}
      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      <Pressable
        style={[styles.button, { opacity: code.includes('') ? 0.5 : 1 }]}
        onPress={handleConfirm}
        disabled={code.includes('')}
      >
        <Text style={styles.buttonText}>Подтвердить код</Text>
      </Pressable>

      <Pressable
        style={[styles.resendButton, { opacity: canResend ? 1 : 0.5 }]}
        disabled={!canResend}
        onPress={handleSendCall}
      >
        <Text style={styles.resendText}>
          {canResend ? 'Отправить код повторно' : `Повторная отправка через ${timer} сек.`}
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  button: { backgroundColor: 'black', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18 },
  resendButton: { marginTop: 20 },
  resendText: { color: 'blue', fontSize: 16 },
  inputContainer: { marginVertical: 24 },
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
  errorText: { color: 'red', textAlign: 'center', marginBottom: 8 },
  successText: { color: 'green', textAlign: 'center', marginBottom: 8 },
});
