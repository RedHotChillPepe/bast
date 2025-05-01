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
  const { usertype } = regData;
  const [sendError, setSendError] = useState('');
  const [inputName, setInputName] = useState('')
  const [inputSurname, setInputsurname] = useState('')
  const [inputFathername, setInputFathername] = useState('')
  const [inputBirthdate, setInputBirthdate] = useState(new Date())
  const currentDate = useRef(inputBirthdate)

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');



  const [companyName, setCompanyName] = useState('');
  const [OGRN, setOGRN] = useState('');
  const [creationDate, setCreationDate] = useState(new Date());
  const [showCreationPicker, setShowCreationPicker] = useState(false);


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
      setSendError('')

      if ((isIndividual || isRealtor) && (!inputName.trim() || !inputSurname.trim())) {
        setSendError('Имя и фамилия обязательны');
        return;
      }

      if (isCompany && (!companyName.trim() || !OGRN.trim())) {
        setSendError('Название компании и ОГРН обязательны');
        return;
      }

      if (email && emailError) {
        setSendError('Введите корректный email.');
        return;
      }

      try {
        // const birthdateFormatted =
        //   inputBirthdate !== currentDate.current && calculateAge(inputBirthdate) >= 18
        //     ? inputBirthdate.toISOString().split('T')[0] // YYYY-MM-DD
        //     : undefined;

        let tempData = {
          phoneNumber: regData.phoneNumber,
          password: regData.password,
          email: regData.email || undefined,
          usertype: regData.usertype,
        };

        if (regData.usertype === 1 || regData.usertype === 3) {
          tempData = {
            ...tempData,
            surname: inputSurname || undefined,
            name: inputName || undefined,
            email: regData.email || undefined,
            // fathername: inputFathername || undefined,
            // birthdate: birthdateFormatted,
          };
        }

        if (regData.usertype === 2) {
          tempData = {
            ...tempData,
            companyName: companyName || undefined,
            OGRN: OGRN || undefined,
            // creationDate: creationDate.toISOString().split('T')[0],
          };
        }

        console.log(tempData);

        const response = await registerUser(tempData);
        const json = await response.json();

        if (response.ok) {
          await setAuth([{
            access_token: json.access_token,
            refresh_token: json.refresh_token,
          }]);

          setCheckAuthB(true);
          // navigation.navigate('Main');
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

    await sendRegister()
    // if (skip) {
    //   await sendRegister()
    // } else if (calculateAge(inputBirthdate) < 18) {
    //   setShowDateLabel(true)
    // } else {
    //   await sendRegister()
    // }

  }

  const onDateSelect = (event, selectedDate) => {
    setShowDatePicker(false)
    console.log(selectedDate);
    setInputBirthdate(selectedDate)

  }

  const isIndividual = regData.usertype === 1;
  const isCompany = regData.usertype === 2;
  const isRealtor = regData.usertype === 3;

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

      {(isIndividual || isRealtor) && (
        <>
          <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Фамилия</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Фамилия*"
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
              placeholder="Имя*"
              value={inputName}
              onChangeText={setInputName}
            />
          </View>

          {/* <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Отчество</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Отчество"
              value={inputFathername}
              onChangeText={setInputFathername}
            />
          </View> */}

          {/* <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Дата рождения</Text>
            </View>
            <Pressable onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Дата рождения"
                value={`${inputBirthdate.getDate().toString().padStart(2, '0')}.` +
                  `${(inputBirthdate.getMonth() + 1).toString().padStart(2, '0')}.` +
                  `${inputBirthdate.getFullYear()}`}
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
          </View> */}
        </>
      )}

      {isCompany && (
        <>
          <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Название компании</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Название*"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>ОГРН</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="ОГРН*"
              value={OGRN}
              onChangeText={setOGRN}
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.block}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Дата основания</Text>
            </View>
            <Pressable onPress={() => setShowCreationPicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Дата создания"
                value={`${creationDate.getDate().toString().padStart(2, '0')}.` +
                  `${(creationDate.getMonth() + 1).toString().padStart(2, '0')}.` +
                  `${creationDate.getFullYear()}`}
                editable={false}
                pointerEvents="none"
              />
            </Pressable>
            {showCreationPicker && (
              <DateTimePicker
                value={creationDate}
                mode='date'
                display="default"
                onChange={(event, selectedDate) => {
                  setShowCreationPicker(false);
                  if (selectedDate) setCreationDate(selectedDate);
                }}
              />
            )}
          </View> */}
        </>
      )}

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Почта </Text>
        </View>
        <TextInput
          style={[styles.input, emailError ? { borderColor: 'red' } : null]}
          placeholder="example@email.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            if (text.trim() === '' || emailRegex.test(text.trim())) {
              setEmailError('');
            } else {
              setEmailError('Некорректный email');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError !== '' && (
          <Text style={styles.inputLabel}>{emailError}</Text>
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
        {/* <Pressable style={{
          paddingVertical: 8,
          paddingHorizontal: 16, borderRadius: 12,
          marginTop: 44
        }}
          onPress={() => handlePost(true)}>

          <Text style={{ fontSize: 20, color: 'black' }}>
            Пропустить
          </Text>
        </Pressable> */}

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