import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'

const DynamicHousesPage = () => {

    const navigation = useNavigation()
    const constHouses = houses
    //console.log(constHouses);
    
  return (
    <View style={styles.container}>
        <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center'}} style={styles.scrollView}>
            <View style={styles.content}>
                {
                    constHouses.map((item, index) => (
                        <View style={styles.cradsWrapper} key={index}>
                            <Pressable onPress={() => {navigation.navigate('House', {"house":item})}} style={styles.houseCard}>
                                <Text>{item.name}</Text> 
                            </Pressable>
                        </View>
                    ))
                }  
            </View>
            
        </ScrollView>
      
    </View>
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