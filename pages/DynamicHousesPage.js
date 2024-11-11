import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'


const { width } = Dimensions.get('window');

const DynamicHousesPage = ({route}) => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getAllPosts } = useApi()

    const {searchPrepopulate} = route.params
    
    useEffect(() => {
      const loadFromAPI = async () => {
        setHouses(await getAllPosts())
        //console.log(await getAllPosts());
        
      }
      
      loadFromAPI()
      return () => {
        
      }
    }, [])
        
    
  return (
    <SafeAreaView style={styles.container}>
        
        <View style={styles.content}>
            <View style={styles.housesView}>

            
                    {
                        Object.keys(houses).length != 0 && houses != undefined ?
                        <FlatList
                        data={houses}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}, index) => 
                        <Pressable onPress={() => navigation.navigate("House", {houseId:item.id})}>   
                            <View style={styles.houseItem}>
                                <View style={styles.houseImageView}>
                                    <Image style={styles.houseImage} width={100} height={100} source={{uri:item.photos[0]}}/>
                                </View>
                                <View>
                                    <View style={{flexDirection:'row', alignItems:'flex-end'}}>
                                        <Text style={styles.houseItemText}>
                                            {item.price != null && item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                                        </Text>
                                        <Text style={{fontSize: 12, marginLeft: 8, fontWeight:'200'}}>
                                            {Math.floor(item.price / item.house_area)}₽/м2
                                        </Text>
                                    </View>
                                    <View style={{flexDirection:"row", marginLeft: 8, marginTop: 2}}>
                                        <Text style={{fontSize: 14, fontWeight:'600'}}>
                                            {item.bedrooms}-комн.
                                        </Text>
                                        <Text style={{fontSize: 14, fontWeight:'600'}}>
                                            {item.house_area} м²
                                        </Text>
                                        <Text style={{fontSize: 14, fontWeight:'600'}}>
                                            {item.num_floors} этаж
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 12,marginLeft: 8, fontWeight:'200', marginTop: 2, marginBottom: 12}}>
                                        {item.city}, {item.full_address}
                                    </Text>
                                </View>
                                
                            </View>
                        </Pressable> 
                        }/>
                        :
                        <ActivityIndicator
                        size={"large"}
                        color={"#32322C"}/>
                    } 
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
    },
    content: {
        
        
    },
    housesView:{
        width:width,
        
        flexDirection:'column',
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