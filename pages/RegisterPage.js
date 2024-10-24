import { Button, StyleSheet, Text, TextInput, View, Dimensions, Pressable  } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const {width} = Dimensions.get('window');

const RegisterPage = () => {
    const { setIsAuth } = useAuth()

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
  <Text style={styles.titleText} >Фамилия:</Text>
  </View>
  <TextInput
    style={styles.input}
    placeholder="Фамилия"
  />
</View>

<View style={styles.block}>
  <View style={styles.title}>
  <Text style={styles.titleText} >Имя:</Text>
  </View>
  <TextInput
    style={styles.input}
    placeholder="Имя"
  />
</View>

<View style={styles.block}>
<View style={styles.title}>
  <Text style={styles.titleText}>Отчество:</Text>
  </View>
  <TextInput
    style={styles.input}
    placeholder="Отчетсво"
  />
</View>


<Pressable style={{backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginTop: 44}} 
           onPress={() => setIsAuth(true)}>
  <Text style={{fontSize: 20, color:'white'}}>
    Зарегистрироваться
  </Text>
</Pressable>

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
})