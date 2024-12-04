import { Button, StyleSheet, Text, View} from 'react-native'
import React from 'react'

import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Error404 = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{flex: 1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize: 96, fontWeight:'800', color:'#0077FF'}}>404</Text>
      <Text>Oops... No page found.</Text>
      <Button title='Home' onPress={() => navigation.navigate("Main")}/>

    </SafeAreaView>
  )
}

export default Error404

const styles = StyleSheet.create({})