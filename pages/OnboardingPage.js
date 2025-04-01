import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../context/AuthContext'

const OnboardingPage = () => {
  const { setOnboard, logout } = useAuth()
  async function localSetOnboard(params) {
    await setOnboard(params)
  }

  return (
    <View>
      <Text>OnboardingPage</Text>
      <View style={{ width: 100 }}>
        <Button title='Onboard' onPress={() => localSetOnboard(true)} />
        <Button title='Logout' onPress={() => logout()} />
      </View>
    </View>
  )
}

export default OnboardingPage

const styles = StyleSheet.create({})