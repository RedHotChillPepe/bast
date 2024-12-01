import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import HouseCard from '../components/HouseCard.js'



const { width } = Dimensions.get('window');


const FavouritesPage = ({route}) => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getAllPosts } = useApi()


    useEffect(() => {
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (Object.keys(houses).length === 0) {
        const loadFromAPI = async () => {
          try {
            const response = await getAllPosts();
            // Убедимся, что `response` является массивом
            setHouses(Array.isArray(response) ? response : []);
          } catch (error) {
            console.error("Error fetching posts:", error);
            setHouses([]); // Устанавливаем пустой массив при ошибке
          }
        };
        loadFromAPI();
      }
    }, [houses, getAllPosts]); // Зависимость от `houses` и `getAllPosts`
        
    
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 24, fontWeight: '600',marginTop: 16, marginBottom: 32, textAlign:'left',alignSelf:'flex-start', marginLeft:32}}>Избранное</Text>
      <View style={styles.content}>
        <View style={styles.housesView}>
            {Object.keys(houses).length != 0 && houses != undefined ? (
            <HouseCard data={houses} 
                       navigation={navigation} 
                       itemWidth={Dimensions.get('window').width -32} 
                       horizontalScroll={false} />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        )}
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