import { Button, StyleSheet, Text, TextInput, View, Dimensions, Pressable  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext';

const {width} = Dimensions.get('window');

const RegisterPage = () => {
    const {getUser} = useApi()
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const [doublePass, setDoublePass] = useState('')

    const [isPasswordLabelShown, setIsPasswordLabelShown] = useState(false)
    const [isPhoneLabelShown, setIsPhoneLabelShown] = useState(false)
    const [isUserExistsLabelShown, setIsUserExistsLabelShown] = useState(false)

    const handleSubmit = async () => {
      const phonePattern = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g

      if (password != doublePass) {
        setIsPasswordLabelShown(true)
      } else {
        if (!phonePattern.test(phoneNumber)) {
          console.log(phonePattern.test(phoneNumber));
          console.log(phoneNumber);
          
          setIsPhoneLabelShown(true)
        } else {
          const result = await getUser(phoneNumber)
          const resultJson = JSON.parse([await result.text()])
            if (await result.status == 200) {
              if (resultJson.result) {
                setIsUserExistsLabelShown(true)
              } else {
                navigation.navigate("PersonalData", {
                    regData:{
                    phoneNumber: phoneNumber,
                    password: password
                  }
                })
              }
            }
          
        }
      }
    }

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent:'center',
      alignItems:'center'
    }}>
      <View style={{marginBottom: 48}}>
        <Text style={styles.h1}>
              Регистрация
        </Text>
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText} >Телефон:</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="+7 (912) 444-22-11"
          keyboardType='phone-pad'
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
        />
        {
          isPhoneLabelShown
          &&
          <Text style={styles.inputLabel}>Неверный номер телефона</Text>
        }
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText} >Пароль:</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          maxLength={20}
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Введите пароль еще раз:</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry={true}
          value={doublePass}
          onChangeText={text => setDoublePass(text)}
          maxLength={20}
        />
        {
          isPasswordLabelShown 
          &&
          <Text style={styles.inputLabel}>Пароли не совпадают</Text>
        }
        
      </View>


      <Pressable style={{backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginTop: 44}} 
                //  onPress={() => setIsAuth(true)}
                onPress={() => handleSubmit()}>
        <Text style={{fontSize: 20, color:'white'}}>
          Подтвердить
        </Text>
      </Pressable>

        {
          isUserExistsLabelShown
          &&
          <Text style={styles.inputLabel}>Этот телефон уже зарегистрирован</Text>
        }

    </SafeAreaView>

  )
}

export default RegisterPage

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 32,
    width: width, 
  },

  h1: {
    fontSize: 32,
    fontWeight: '600'
  },

  title: {
    marginBottom:4
  },

  titleText: {
    fontSize:18,
    fontWeight: '500',
  },

  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  inputLabel:{
    color:"red"
  }
})