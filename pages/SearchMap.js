import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YaMap, Marker } from 'react-native-yamap';
import { Geocoder } from 'react-native-yamap';
import { useApi } from '../context/ApiContext';
import { Text } from 'react-native';

export default function SearchMap({ navigation, route }) {
  const { getAllPosts, getPaginatedPosts } = useApi();
  const { query } = route.params


  const [posts, setPosts] = useState([])

  useEffect(() => {
    // FIXME Крайне неоптимальный код, срочно поменять
    const loadMarkers = async () => {
      console.log(query);

      const tempHouses = query.length == 0 ? await getAllPosts() : await getPaginatedPosts("undefined", query) // FIXME

      if (await tempHouses[0][0].id != undefined) {
        tempHouses[0].forEach(house => {
          if (house.longitude != null || house.latitude != null) {
            setPosts((prevData) => [...prevData, { point: { lon: parseFloat(house.longitude), lat: parseFloat(house.latitude) }, id: house.id }])
          } else {
            const addressString = house.city + " " + house.full_address
            Geocoder.addressToGeo(addressString)
              .then(({ lat, lon }) => {
                setPosts((prevData) => [...prevData, { point: { lon: lon, lat: lat }, id: house.id }])
              })
          }

        });
      }
    }
    loadMarkers()
    return () => { }
  }, [])


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {process.env.NODE_ENV !== "development" ? <YaMap style={{ width: '100%', height: '100%', alignSelf: 'center' }}
        initialRegion={{ lat: 56.84976, lon: 53.20448, zoom: 10 }}>

        {
          Object.keys(posts).length != 0
          &&
          posts.map((post, index) =>
            <Marker key={index} onPress={() => navigation.navigate('House', { houseId: post.id })} point={post.point} source={require('../assets/marker.png')} scale={0.4} />
          )
        }

        {/* <Marker onPress={() => navigation.navigate('Error404')} point={{ lat: 56.84976,lon: 53.20448 }} source={require('../assets/marker.png')} scale={0.4}/> */}

      </YaMap> : <Text style={{ fontSize: 24, textAlign: "center", color: "red" }}>Карта</Text>}
    </SafeAreaView>
  )
}