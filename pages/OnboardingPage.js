import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'

const OnboardingPage = () => {
    const { setOnboard, logout } = useAuth()
    async function localSetOboard (params) {
      await setOnboard(params)
    }
    
  return (
    <View>
      <Text>OnboardingPage</Text>
      <View style={{width:100}}>
        <Button title='Onboard' onPress={() => localSetOboard(true)}/>
        <Button title='Logout' onPress={() => logout()}/>
      </View>
    </View>
  )
}

export default OnboardingPage

const styles = StyleSheet.create({})