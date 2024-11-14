import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import HouseCard from '../components/HouseCard.js'


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
      const loadFromAPI = async () => {
        try {
          const response = await getAllPosts();
          // Проверяем, что `response` является массивом
          setHouses(Array.isArray(response) ? response : []);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setHouses([]); // Если ошибка, устанавливаем пустой массив
        }
      };
      
      loadFromAPI();
    }, []);
        
    
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', width: width-32, justifyContent:'space-between'}}>
        <Pressable>
          <Text>Фильтры</Text>
        </Pressable>
        <Pressable>
          <Text>Сортировка</Text>
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
    content: {
        
        
    },
    housesView:{
        width:width,
        

        alignItems:'center'
        
    },
    houseItem:{
        width: width*0.80,
        borderRadius:24,
        backgroundColor:"#FFF",
        marginBottom:12
    },
    houseItemText:{
        color:"#32322C",
        // fontFamily:"Inter700",
        fontSize:16,
        fontWeight:'700',
        marginLeft: 8,
        marginTop: 16
    },
    houseImageView:{
        height:130
    },
    houseImage:{
        flex:1,
        height:"100%",
        width:"100%",
        borderTopLeftRadius:20,
        borderTopRightRadius:20
    }
})