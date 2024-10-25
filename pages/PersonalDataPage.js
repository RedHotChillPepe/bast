import { Button, StyleSheet, Text, TextInput, View, Dimensions, Pressable  } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const {width} = Dimensions.get('window');

const PersonalDataPage = () => {
    const { setIsAuth } = useAuth()
    const navigation = useNavigation()

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

        <TextInput
          style={styles.input}
          placeholder="26.04.1986"
        />
      </View>

      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
        <Pressable style={{paddingVertical: 8, 
        paddingHorizontal: 16, borderRadius: 12, 
        marginTop: 44}} 
        onPress={() => setIsAuth(true)}>

          <Text style={{fontSize: 20, color:'black'}}>
            Пропустить
          </Text>

        </Pressable>

        <Pressable style={{backgroundColor: 'black', 
        paddingVertical: 8, paddingHorizontal: 16, 
        borderRadius: 12, marginTop: 44}} 
        onPress={() => setIsAuth(true)}>

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
})