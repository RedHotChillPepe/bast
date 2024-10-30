import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'

const ProfilePage = () => {
  const { logout } = useAuth()
  return (
    <View>
      <Text>ProfilePage</Text>
      <Button title='Logout' onPress={() => logout()}/>
    </View>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})