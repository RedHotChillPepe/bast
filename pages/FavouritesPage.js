import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import HouseCard from '../components/HouseCard.js'
import * as SecureStore from 'expo-secure-store';



const { width } = Dimensions.get('window');


const FavouritesPage = ({route}) => {

  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [houses, setHouses]= useState([])
  const [isFavs, setIsFavs]= useState(true)

  const {getPost} = useApi()

  useEffect(() => {
    const getFavHouses = async () => {
      const favs = JSON.parse(await SecureStore.getItemAsync("favs"))
      console.log(favs);
        
      if (favs == null) {
        setIsFavs(false)
        
      } else if (Object.keys(favs).length != 0) {
        const tempHouses = []

        for (let index = 0; index < favs.length; index++) {
          const result = await getPost(favs[index])
          const resultJson = JSON.parse(await result.text())
          tempHouses.push(resultJson.rows[0])          
        }
        setHouses(tempHouses)
      }
    }

    getFavHouses()

    }, [isFocused]);
        
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.housesView}>
        {Object.keys(houses).length != 0 && houses != undefined 
          ? 
          <HouseCard data={houses} 
            navigation={navigation} 
            itemWidth={Dimensions.get('window').width -32} 
            horizontalScroll={false} 
          />
          :
            isFavs 
            ? 
            <ActivityIndicator size="large" color="#32322C" /> 
            :
            <Text>У вас нет избранных!</Text>
          }
         </View>  
      </View>      
    </SafeAreaView>
  )
}

export default FavouritesPage

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        alignItems:'center'
    },
        
    housesView:{
        width:width,
        alignItems:'center'   
    },


})