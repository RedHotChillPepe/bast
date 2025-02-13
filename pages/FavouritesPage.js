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

  const {getManyPosts} = useApi()

  useEffect(() => {
    const getFavHouses = async () => {
      const favs = JSON.parse(await SecureStore.getItemAsync("favs"))

      console.log(favs);
        
      if (favs == null) {
        setIsFavs(false)
        
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
        <View style={styles.housesView}>
          {houses.length > 0 ? (
            <FlatList
              data={houses}
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
          ) : isFavs ? (
            <ActivityIndicator size="large" color="#32322C" />
          ) : (
            <Text style={styles.noFavsText}>У вас нет избранных!</Text>
          )}
          <View style={{height: 512}} />
        </View>
        
    </View>
  )
}

export default FavouritesPage

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F2F2F7',
        alignItems:'center',
    },
        
    housesView:{
        width:width,
        alignItems:'center', 
    },


})