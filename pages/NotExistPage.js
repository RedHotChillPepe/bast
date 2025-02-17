import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window');

const NotExistPage = () => {
    const navigation = useNavigation()
 
  return (
    <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent:'center' }}>

<Text style={{fontSize: 36, fontWeight: 600, textAlign:'center'}}>Этот блок появится позже</Text>
      <View>
        <Pressable style={{backgroundColor:'white',
                           borderColor: 'black',
                           borderWidth: 1,
                           paddingHorizontal: 16,
                           paddingVertical: 8,
                           borderRadius: 16,
                           alignItems:'center',
                           justifyContent:'center',
                           marginTop: 96}}
            onPress={() => navigation.goBack()}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: 400}}>Назад</Text>
        </Pressable>
      </View>
      
    </SafeAreaView>
  )
}

export default NotExistPage

const styles = StyleSheet.create({})