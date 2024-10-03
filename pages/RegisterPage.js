import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const { setIsAuth } = useAuth()

  return (
    <View>
      <Button title='Register' onPress={() => setIsAuth(true)} />
    </View>
  )
}

export default RegisterPage

const styles = StyleSheet.create({})