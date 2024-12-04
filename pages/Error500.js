import { Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Error500 = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize: 96, fontWeight:'800', color:'#0077FF'}}>500</Text>
      <Text>There was an error on the server. Please wait, we will fix it soon</Text>
      <Button title='Home' onPress={() => navigation.navigate("Main")}/>

    </SafeAreaView>
  )
}

export default Error500

const styles = StyleSheet.create({})