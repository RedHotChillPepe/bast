import { Button, Pressable, StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window');



const LoginPage = () => {
    const navigation = useNavigation()
    const { authVK } = useAuth()
  return (
    <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent:'center' }}>
      <View style={{alignItems: 'center', marginBottom: 32}}>
        <Text style={{fontSize: 64, fontWeight: 600}}>БАСТ</Text>
        <Text style={{fontSize: 24, fontWeight: 400}}>Недвижимость</Text>
      </View>

      <View>
          <Pressable style={{backgroundColor:'black',
                            width: width*0.65,
                            height: height*0.055,
                            borderRadius: 16,
                            alignItems:'center',
                            justifyContent:'center',
                            marginBottom: 8}}
                            onPress={()=> navigation.navigate("LoginEntry")} 
            >
            <Text style={{color: 'white', fontSize: 18}}>Войти</Text>
          </Pressable>
      </View>

      <View>
        <Pressable style={{backgroundColor:'white',
                           borderColor: 'black',
                           borderWidth: 1,
                           width: width*0.65,
                           height: height*0.055,
                           borderRadius: 16,
                           alignItems:'center',
                           justifyContent:'center'}}
                   onPress={() => navigation.navigate("Register")}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: 400}}>Регистрация</Text>
        </Pressable>
      </View>
      
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width: width*0.65, marginTop:12}}>

        <View style={{height:50, width:50, flexDirection:'row', alignItems:'center'}}>
          <Pressable onPress={()=>authVK()} style={{ flex:1, backgroundColor:"#0077FF", borderRadius:12,alignItems:'center'}}>
            <Image height={50} width={50} source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/VK_Compact_Logo_%282021-present%29.svg/2048px-VK_Compact_Logo_%282021-present%29.svg.png"}}/>
          </Pressable>
        </View>
        <View style={{height:50, width:50, flexDirection:'row', alignItems:'center'}}>
          <Pressable style={{ flex:1, backgroundColor:"#d1cfcf", borderRadius:12,alignItems:'center'}}>
            <Image height={50} width={50} source={{uri:"https://raw.githubusercontent.com/2fasvg/2fasvg.github.io/master/assets/img/logo/gosuslugi.ru/gosuslugi.ru.png"}}/>
          </Pressable>
        </View>
        <View style={{height:50, width:50, flexDirection:'row', alignItems:'center'}}>
          <Pressable style={{ flex:1, backgroundColor:"#d1cfcf", borderRadius:12,alignItems:'center'}}>
          <Image height={50} width={50} source={{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/1024px-Yandex_icon.svg.png"}}/>
          </Pressable>
        </View>
        
      </View>
      
    </SafeAreaView>
  )
}

export default LoginPage

const styles = StyleSheet.create({})