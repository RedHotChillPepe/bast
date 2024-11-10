import { Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigation } from '@react-navigation/native'

const ProfilePage = () => {
  const { logout } = useAuth()
  const navigation = useNavigation()
  return (
    <View>
      <Text>ProfilePage</Text>
      <Button title='Logout' onPress={() => logout()}/>
      <Button title='Экран Страницы не существует' onPress={() => navigation.navigate("NotExistPage")}/>

    </View>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})