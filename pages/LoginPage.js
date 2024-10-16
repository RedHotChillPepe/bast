import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoginPage = () => {
    const navigation = useNavigation()
    const { setIsAuth, setIsOnboarded } = useAuth()
  return (
    <SafeAreaView>
      <Text>LoginPage</Text>
      <View style={{width:100}}>
        <Button title='Login' onPress={() => {setIsAuth(true), setIsOnboarded(true)}}/>
      </View>
      
      <View style={{width:100, paddingVertical:15}}>
        <Button title='Register' onPress={() => navigation.navigate("Register")}/>
      </View>
      
    </SafeAreaView>
  )
}

export default LoginPage

const styles = StyleSheet.create({})