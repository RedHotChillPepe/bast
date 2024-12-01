import { Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Error503 = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize: 96, fontWeight:'800', color:'#0077FF'}}>503</Text>
      <Text>We apologize for the inconvenience. Try reloading the page.</Text>
      <Button title='Home' onPress={() => navigation.navigate("MainPage")}/>

    </SafeAreaView>
  )
}

export default Error503

const styles = StyleSheet.create({})