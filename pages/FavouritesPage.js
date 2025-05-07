import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import HouseCard from '../components/HouseCard.js'
import { useApi } from '../context/ApiContext.js'
import { useFavorites } from '../context/FavoritesContext.js'

const { width, height } = Dimensions.get('window');

const FavouritesPage = ({ route }) => {

  const navigation = useNavigation()
  const { favorites } = useFavorites();

  const [houses, setHouses] = useState([])
  const { getManyPosts } = useApi()

  useEffect(() => {
    const getFavHouses = async () => {
      try {
        if (favorites.length == 0) {
          setHouses([]);
          return
        };
        const tempHouses = await getManyPosts(favorites)
        if (tempHouses.statusCode) throw new Error(tempHouses.message)
        setHouses(tempHouses)
      } catch (error) {
        console.log(error.message);
      }
    }

    getFavHouses()

  }, [favorites]);


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#fff"} />
      {Object.keys(houses).length != 0 ? (
        <View style={styles.housesView}>
          <FlatList
            data={houses}
            style={{ paddingBottom: 512 }}
            renderItem={({ item }) => (
              <HouseCard
                item={item}
                navigation={navigation}
                itemWidth={width - 32}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 128 }} />}
          />
        </View>
      ) : favorites.length > 0 ? (
        <ActivityIndicator size="large" color="#32322C" />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.noFavsText}>У вас нет избранных объявлений</Text>
        </View>
      )}
    </View>
  )
}

export default FavouritesPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },

  housesView: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noFavsText: {
    fontSize: 22,
    lineHeight: 25,
    fontWeight: 500,
    letterSpacing: -0.43
  },


})