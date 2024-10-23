import { Button, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window');

const LoginPage = () => {
    const navigation = useNavigation()
    const { setIsAuth, setIsOnboarded } = useAuth()
  return (
    <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent:'center' }}>
      <View style={{alignItems: 'center', marginBottom: 32}}>
        <Text style={{fontSize: 64, fontWeight: 600}}>БАСТ</Text>
        <Text style={{fontSize: 24, fontWeight: 400}}>Недвижимость</Text>
      </View>

      <View>
        {/* <Button title='Login' onPress={() => {setIsAuth(true), setIsOnboarded(true)}}/> */}
          <Pressable style={{backgroundColor:'black',
                            width: width*0.65,
                            height: height*0.055,
                            borderRadius: 16,
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom: 8}} 
                     onPress={() => {setIsAuth(true), setIsOnboarded(true)}}>
            <Text style={{color: 'white', fontSize: 18}}>Войти</Text>
          </Pressable>
      </View>

      <View>
        {/* <Button title='Register' onPress={() => navigation.navigate("Register")}/> */}
        <Pressable style={{backgroundColor:'white',
                           borderColor: 'black',
                           borderWidth: 1,
                           width: width*0.65,
                           height: height*0.055,
                           borderRadius: 16,
                           alignItems:'center',
                           justifyContent:'center'}}
                   onPress={() => navigation.navigate("Register")}>
            <Text style={{color: 'black', fontSize: 18, fontWeight: 400}}>Регистрация</Text>
          </Pressable>
      </View>
      
    </SafeAreaView>
  )
}

export default LoginPage

const styles = StyleSheet.create({})