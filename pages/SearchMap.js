import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import  { YaMap, Marker } from 'react-native-yamap';
import { Geocoder } from 'react-native-yamap';
import { useApi } from '../context/ApiContext';

export default function SearchMap ({ navigation, route }) {
  const { getAllPosts} = useApi();

  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    // FIXME Крайне неоптимальный код, срочно поменять
    const loadMarkers = async () => {
      const tempHouses = await getAllPosts() // FIXME
      if (await tempHouses[0].id != undefined) {
        tempHouses.forEach(house => {
          if (house.longitude != null || house.latitude != null) {
            setPosts((prevData) => [...prevData, {point:{lon:parseFloat(house.longitude), lat:parseFloat(house.latitude)}, id:house.id}])
          } else {
            const addressString = house.city + " " + house.full_address
            Geocoder.addressToGeo(addressString)
            .then(({lat, lon}) => {
              setPosts((prevData) => [...prevData, {point:{lon:lon, lat:lat}, id:house.id}])
            })
          }
          
        });
      }
    }
    loadMarkers()
  return () => {}}, [])
  

    return (
        <SafeAreaView style={{flex:1}}>
          <YaMap  style={{width:'100%', height:'100%', alignSelf:'center'}}
            initialRegion={{lat: 56.84976,lon: 53.20448,zoom: 10}}>

              {
                Object.keys(posts).length != 0 
                &&
                posts.map((post, index) => 
                  <Marker key={index} onPress={() => navigation.navigate('House', { houseId: post.id })} point={post.point} source={require('../assets/marker.png')} scale={0.4}/>
                )
              }

            {/* <Marker onPress={() => navigation.navigate('Error404')} point={{ lat: 56.84976,lon: 53.20448 }} source={require('../assets/marker.png')} scale={0.4}/> */}

          </YaMap> 
        </SafeAreaView>
        )
}