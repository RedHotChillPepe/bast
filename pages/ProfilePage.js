import { Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ProfilePage = () => {
  const { logout } = useAuth()
  const navigation = useNavigation()
  return (
    <SafeAreaView>
      <Text>ProfilePage</Text>
      <Button title='Logout' onPress={() => logout()}/>
      <Button title='404' onPress={() => navigation.navigate("Error404")}/>
      <Button title='403' onPress={() => navigation.navigate("Error403")}/>
      <Button title='500' onPress={() => navigation.navigate("Error500")}/>
      <Button title='503' onPress={() => navigation.navigate("Error503")}/>

    </SafeAreaView>
  )
}

export default ProfilePage

const styles = StyleSheet.create({})