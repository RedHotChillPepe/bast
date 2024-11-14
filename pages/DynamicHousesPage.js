import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import HouseCard from '../components/HouseCard.js'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');

const DynamicHousesPage = ({route}) => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getAllPosts } = useApi()

    //const {searchPrepopulate} = route.params
    
    // useEffect(() => {
    //   const loadFromAPI = async () => {
    //     setHouses(await getAllPosts())
    //     //console.log(await getAllPosts());
        
    //   }
      
    //   loadFromAPI()
    //   return () => {
        
    //   }
    // }, [])

    useEffect(() => {
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (houses.length === 0) {
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

      {/* Категории */}
      <View>
        
      </View>

      {/* Фильтры и сортировка */}
      <View style={{flexDirection: 'row', width: width-32, justifyContent:'space-between'}}>
        <Pressable style={styles.searchButton}>
        <AntDesign name="filter" size={24} color="black" />
          <Text style={styles.searchButtonText}>Фильтры</Text>
        </Pressable>
        <Pressable style={styles.searchButton}>
        <MaterialIcons name="sort" size={24} color="black" />
          <Text style={styles.searchButtonText}>Сортировка</Text>
        </Pressable> 
      </View>

        <View style={styles.content}>
            <View style={styles.housesView}>

            {houses.length ? (
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

export default DynamicHousesPage

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
    searchButton:{
      flexDirection: 'row',
      alignItems:'center',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 12,  
  },
  searchButtonText:{
    color:'black',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
},

})