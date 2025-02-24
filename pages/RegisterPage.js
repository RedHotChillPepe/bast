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
      
      const phonePattern = new RegExp(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)

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
              if (resultJson[0].result) {
                setIsUserExistsLabelShown(true)
              } else {
                navigation.navigate("ConfirmationPage", {
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
      backgroundColor: '#fff',
      justifyContent:'center',
      alignItems:'center'
    }}>
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
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
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
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Подтвердите пароль:</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          secureTextEntry={true}
          value={doublePass}
          onChangeText={text => setDoublePass(text)}
          maxLength={20}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
        />
        {
          isPasswordLabelShown 
          &&
          <Text style={styles.inputLabel}>Пароли не совпадают</Text>
        }
        
      </View>



      <Pressable style={{backgroundColor: '#007AFF', paddingVertical: 7, paddingHorizontal: 14, borderRadius: 12, marginTop: 32}} 
                //  onPress={() => setIsAuth(true)}
                onPress={() => handleSubmit()}
                >
        <Text style={{fontSize: 17, lineHeight: 22, letterSpacing: -0.43, color:'white'}}>
          Подтвердить
        </Text>
      </Pressable>

        {
          isUserExistsLabelShown
          &&
          <Text style={styles.inputLabel}>Этот номер телефона уже зарегистрирован</Text>
        }

    </SafeAreaView>

  )
}

export default RegisterPage

const styles = StyleSheet.create({
  block: {
    width: width*0.6, 
    marginBottom: 24
  },

  h1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.38,
    fontWeight: '600'
  },

  title: {
    marginBottom:12
  },

  titleText: {
    fontSize:20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'rgba(120,120,128, 0.12)',
    height: 40,
    width: width * 0.6,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  inputLabel:{
    color:"red"
  }
})