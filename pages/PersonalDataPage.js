import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApi } from '../context/ApiContext'
import { useAuth } from '../context/AuthContext'
import { useLogger } from "../context/LoggerContext"

const { width } = Dimensions.get('window');

const PersonalDataPage = ({ route }) => {
  const { setAuth, setCheckAuthB } = useAuth()
  const { registerUser } = useApi()
  const navigation = useNavigation()

  const { regData } = route.params

  const [sendError, setSendError] = useState('');

  const [inputName, setInputName] = useState('')
  const [inputSurname, setInputsurname] = useState('')
  const [inputFathername, setInputFathername] = useState('')
  const [inputBirthdate, setInputBirthdate] = useState(new Date())
  const currentDate = useRef(inputBirthdate)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDateLabel, setShowDateLabel] = useState(false)

  const { logError } = useLogger();

  function calculateAge(birthday) { // принимает Date объект
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const handlePost = async (skip) => {
    const sendRegister = async () => {
      try {
        const birthdateFormatted =
          inputBirthdate !== currentDate.current && calculateAge(inputBirthdate) >= 18
            ? inputBirthdate.toISOString().split('T')[0] // YYYY-MM-DD
            : undefined;

        const tempData = {
          phoneNumber: regData.phoneNumber,
          password: regData.password,
          surname: inputSurname || undefined,
          name: inputName || undefined,
          fathername: inputFathername || undefined,
          birthdate: birthdateFormatted,
          email: regData.email || undefined,
        };

        const response = await registerUser(tempData);
        const json = await response.json();

        if (response.ok) {
          await setAuth([{
            access_token: json.access_token,
            refresh_token: json.refresh_token,
          }]);

          setCheckAuthB(true);
          navigation.navigate('Main'); // или куда нужно
        } else {
          setSendError(json.message || 'Ошибка при создании пользователя.');
        }
      } catch (error) {
        logError(navigation.getState().routes[0].name, error, {
          handleName: "sendRegister",
        });
        setSendError('Произошла ошибка при создании аккаунта. Попробуйте позже.');
      }
    };

    if (skip) {
      await sendRegister()
    } else if (calculateAge(inputBirthdate) < 18) {
      setShowDateLabel(true)
    } else {
      await sendRegister()
    }

  }



  const onDateSelect = (event, selectedDate) => {
    setShowDatePicker(false)
    console.log(selectedDate);
    setInputBirthdate(selectedDate)

  }


  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      <View style={{ marginBottom: 48 }}>
        <Text style={styles.h1}>
          Персональные данные
        </Text>
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Фамилия</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Фамилия"
          value={inputSurname}
          onChangeText={setInputsurname}
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Имя</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Имя"
          value={inputName}
          onChangeText={setInputName}
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Отчество</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Отчество"
          value={inputFathername}
          onChangeText={setInputFathername}
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Дата рождения:</Text>
        </View>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Дата рождения"
            value={`${inputBirthdate.getDate().toString().padStart(2, '0')}.` +
              `${(inputBirthdate.getMonth() + 1).toString().padStart(2, '0')}.` +
              `${inputBirthdate.getFullYear().toString()}`}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={inputBirthdate}
            mode='date'
            display="default"
            onChange={onDateSelect}
          />
        )}

        {showDateLabel && (
          <Text style={styles.inputLabel}>
            Вам должно быть больше 18 лет
          </Text>
        )}
      </View>

      {sendError !== '' && (
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>
            {sendError}
          </Text>
        </View>
      )}


      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Pressable style={{
          paddingVertical: 8,
          paddingHorizontal: 16, borderRadius: 12,
          marginTop: 44
        }}
          onPress={() => handlePost(true)}>

          <Text style={{ fontSize: 20, color: 'black' }}>
            Пропустить
          </Text>
        </Pressable>

        <Pressable style={{
          backgroundColor: 'black',
          paddingVertical: 8, paddingHorizontal: 16,
          borderRadius: 12, marginTop: 44
        }}
          onPress={() => handlePost(false)}>

          <Text style={{ fontSize: 20, color: 'white' }}>
            Подтвердить
          </Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );

}

export default PersonalDataPage

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 32,
    width,
  },

  h1: {
    fontSize: 32,
    fontWeight: '600'
  },

  title: {
    marginBottom: 4
  },

  titleText: {
    fontSize: 18,
    fontWeight: '500',
  },

  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  inputLabel: {
    color: "red"
  }
})