import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'

const OnboardingPage = () => {
    const { setIsOnboarded } = useAuth()
  return (
    <View>
      <Text>OnboardingPage</Text>
      <View style={{width:100}}>
        <Button title='Onboard' onPress={() => setIsOnboarded(true)}/>
      </View>
    </View>
  )
}

export default OnboardingPage

const styles = StyleSheet.create({})