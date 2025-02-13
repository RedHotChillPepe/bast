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
    <View style={styles.container}>
        
          {houses.length > 0 ? (
            <View style={styles.housesView}>
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
            <View style={{height: 512}} />
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
        flex:1,
        backgroundColor:'#F2F2F7',
        alignItems:'center',
    },
        
    housesView:{
        width:width,
        alignItems:'center',
        justifyContent: 'center'
    },

    noFavsText: {
      fontSize: 22,
      lineHeight: 25,
      fontWeight: 500,
      letterSpacing: -0.43
    },


})