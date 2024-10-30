import { Button, StyleSheet, Text, TextInput, View, Dimensions, Pressable  } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext'
import DateTimePicker from "@react-native-community/datetimepicker"

const {width} = Dimensions.get('window');

const PersonalDataPage = ({route}) => {
    const { getAuth, setAuth , setCheckAuthB } = useAuth()
    const {postRegister} = useApi()
    const navigation = useNavigation()

    const {regData} = route.params

    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputsurname] = useState('')
    const [inputFathername, setInputFathername] = useState('')
    const [inputBirthdate, setInputBirthdate] = useState(new Date())
    const currentDate = useRef(inputBirthdate)

    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showDateLabel, setShowDateLabel] = useState(false)


    function calculateAge(birthday) { // принимает Date объект
      var ageDifMs = Date.now() - birthday.getTime();
      var ageDate = new Date(ageDifMs); 
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const handlePost = async (skip) => {

      const sendRegister = async () => {
        try {
          var tempData = {
            phoneNumber:regData.phoneNumber,
            password:regData.password,
            name:inputName,
            surname:inputSurname,
            fathername:inputFathername,
            birthdate:inputBirthdate == currentDate.current || calculateAge(inputBirthdate) < 18 ? "":inputBirthdate,
          } 
          const response = await postRegister(tempData)
          if (response.status == "200") {
            await setAuth([{
              status:true,
              onboarded:false,
              phone:regData.phoneNumber,
              password:await response.text()
            }])
            setCheckAuthB(true)
            
          }
        } catch (error) {
          console.error("Error sending register info:", error);
        }
      }

      if (!skip) {
        if (calculateAge(inputBirthdate) < 18) {
          setShowDateLabel(true)
        } else {
          await sendRegister()
        }
      } else {
        await sendRegister()
      }
      
    }

    

    const onDateSelect = (event, selectedDate) =>{
      const currentDate = selectedDate
      setShowDatePicker(false)
      console.log(selectedDate);
      setInputBirthdate(currentDate)
      
    }
    

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent:'center',
      alignItems:'center'
    }}>

      <View style={{marginBottom: 48}}>
        <Text style={styles.h1}>
          Персональные данные
        </Text>
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText} >Фамилия</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Фамилия"
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText} >Имя</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Имя"
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText} >Отчество</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Отчество"
        />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Дата рождения:</Text>
        </View>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <TextInput
          style={styles.input}
          placeholder={inputBirthdate.getDate().toString()+ "." 
            + inputBirthdate.getMonth().toString() + "." 
            + inputBirthdate.getFullYear().toString()}
          editable={false}
          />
        </Pressable>
        

        {
          showDatePicker
          &&
          <DateTimePicker
          value={inputBirthdate}
          mode='date'
          onChange={onDateSelect}/>
        }

        {
          showDateLabel
          &&
          <Text style={styles.inputLabel}>
            Вам не может быть меньше 18 лет
          </Text>
        }
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Pressable style={{paddingVertical: 8, 
        paddingHorizontal: 16, borderRadius: 12, 
        marginTop: 44}} 
        onPress={() => handlePost(true)}>

          <Text style={{fontSize: 20, color:'black'}}>
            Пропустить
          </Text>

        </Pressable>

        <Pressable style={{backgroundColor: 'black', 
        paddingVertical: 8, paddingHorizontal: 16, 
        borderRadius: 12, marginTop: 44}} 
        onPress={() => handlePost(false)}>

          <Text style={{fontSize: 20, color:'white'}}>
            Подтвердить
          </Text>

        </Pressable>
      </View>

    </SafeAreaView>

  )
}

export default PersonalDataPage

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