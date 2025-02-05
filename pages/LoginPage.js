import { Button, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window');

const LoginPage = () => {
    const navigation = useNavigation()
    //const { setIsAuth, setIsOnboarded } = useAuth()
  return (
    <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent:'center', backgroundColor: '#fff'}}>
      <View style={{alignItems: 'center', marginBottom: 48}}>
        <Text style={{fontSize: 64, fontWeight: 700, letterSpacing: -0.8, lineHeight: 80}}>БАСТ</Text>
        <Text style={{fontSize: 22, lineHeight: 28, letterSpacing: -0.26, fontWeight: 500}}>Недвижимость</Text>
      </View>


          <Pressable style={{backgroundColor:'rgba(0, 122, 255, 1)',
                            width: width * 0.5,
                            paddingVertical: 14,
                            borderRadius: 16,
                            alignItems:'center',
                            justifyContent:'center'}}
                            onPress={()=> navigation.navigate("LoginEntry")} 
            >
            <Text style={{color: 'white', fontSize: 18}}>Войти</Text>
          </Pressable>

        <View style={{height: 12}} />

        <Pressable style={{backgroundColor:'rgba(0, 122, 255, 0.15)',
                           width: width * 0.5,
                           paddingVertical: 14,
                           borderRadius: 16,
                           alignItems:'center',
                           justifyContent:'center'}}
                   onPress={() => navigation.navigate("Register")}>
            <Text style={{color: '#007AFF', fontSize: 17, lineHeight: 22, letterSpacing: -0.43, fontWeight: 400}}>Регистрация</Text>
          </Pressable>

      
    </SafeAreaView>
  )
}

export default LoginPage

const styles = StyleSheet.create({})