import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'

const DynamicHousesPage = () => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getAllPosts } = useApi()
    
    useEffect(() => {
      const loadFromAPI = async () => {
        setHouses(await getAllPosts())
        console.log(await getAllPosts());
        
      }
      
      loadFromAPI()
      return () => {
        
      }
    }, [])
        
    
  return (
    <SafeAreaView style={styles.container}>
        {
            Object.keys(houses).length != 0
            &&
            <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center'}} style={styles.scrollView}>
                <View style={styles.content}>
                    {
                        houses.map((item, index) => (
                            <View style={styles.cradsWrapper} key={index}>
                                <Pressable onPress={() => {navigation.navigate('House', {"house":item})}} style={styles.houseCard}>
                                    <Text>{item.name}</Text> 
                                </Pressable>
                            </View>
                        ))
                    }  
                </View>
                
            </ScrollView>
        }
        
      
    </SafeAreaView>
  )
}

export default DynamicHousesPage

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    content: {
        width:'90%',
        marginTop:20
    },
    scrollView:{
        width:"100%",
        height:'100%',
    },
    cradsWrapper:{
        
    },
    houseCard:{
        width:"100%",
        height:40,
        marginBottom:15,
        backgroundColor:'#F5F5F5',
        borderRadius:4
    }
})