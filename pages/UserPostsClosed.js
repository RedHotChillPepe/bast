import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import HouseCard from '../components/HouseCard.js'
import * as SecureStore from 'expo-secure-store';



const { width, height } = Dimensions.get('window');


const UserPostsClosed = ({route}) => {

  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [houses, setHouses]= useState([])
  const [isEmpty, setIsEmpty]=useState(false)

  const {user_id} = route.params

  const {getUserPostsByStatus} = useApi()

  useEffect(() => {
    const getHouses = async () => {
      const tempHouses = await getUserPostsByStatus(user_id, 3)
      const tempHousesJson = JSON.parse(await tempHouses.text())
      
      if (Object.keys(tempHousesJson.rows).length != 0) {
        setHouses(tempHousesJson.rows) 
      }      
      if (Object.keys(tempHousesJson.rows).length == 0) {
        setIsEmpty(true)
      }
    }

    getHouses()

    }, [isFocused]);
        
    
  return (
    <View style={styles.container}>
      {!isEmpty ? (
        <View style={styles.housesView}>
            <FlatList
              data={houses}
              style={{paddingBottom: 512}}
              ListEmptyComponent={<ActivityIndicator size="large" color="#32322C" />}
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
            )  
            : 
              <View style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
                <Text style={styles.noFavsText}>У вас нет закрытых объявлений</Text>
              </View>
            }
          </View>
  )
}

export default UserPostsClosed

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