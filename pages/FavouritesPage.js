import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import HouseCard from '../components/HouseCard.js'
import * as SecureStore from 'expo-secure-store';



const { width, height } = Dimensions.get('window');


const FavouritesPage = ({route}) => {

  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [houses, setHouses]= useState([])
  const [isFavs, setIsFavs]= useState(true)

  const {getManyPosts} = useApi()

  useEffect(() => {
    const getFavHouses = async () => {
      const favs = JSON.parse(await SecureStore.getItemAsync("favs"))

      console.log(favs);
        
      if (favs == null || Object.keys(favs).length == 0) {
        setIsFavs(false)
        setHouses([])
        
      } else if (Object.keys(favs).length != 0) {
        const tempHouses = await getManyPosts(favs)
        
        const tempHousesJson = JSON.parse(await tempHouses.text())
        
        setHouses(tempHousesJson.rows)
      }
    }

    getFavHouses()

    }, [isFocused]);
        
    
  return (
    <View style={styles.container}>
        
          {Object.keys(houses).length != 0 ? (
            <View style={styles.housesView}>
            <FlatList
              data={houses}
              style={{paddingBottom: 512}}
              renderItem={({ item }) => (
                <HouseCard
                  item={item}
                  navigation={navigation}
                  itemWidth={width - 32}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            /> 
          </View>
            ) : isFavs ? (
              <ActivityIndicator size="large" color="#32322C" />
            ) : (
              <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Text style={styles.noFavsText}>У вас нет избранных объявлений</Text>
              </View>
            )}
          </View>
  )
}

export default FavouritesPage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        height: height,
        backgroundColor:'#F2F2F7',
        alignItems:'center',
    },
        
    housesView:{
        width: width,
        alignItems:'center',
        justifyContent: 'center',
    },

    noFavsText: {
      fontSize: 22,
      lineHeight: 25,
      fontWeight: 500,
      letterSpacing: -0.43
    },


})