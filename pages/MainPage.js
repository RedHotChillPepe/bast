import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, FlatList, ActivityIndicator, Dimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import HeaderComponent from '../components/HeaderComponent';


const { width } = Dimensions.get('window');

const MainPage = () => {
    const navigation = useNavigation()
    const {getAllPosts} = useApi()
    const [houses, setHouses] = useState([])

    useEffect(() => {
      const housesFetch = async () => {
        if (await getAllPosts() != undefined) {
            setHouses(await getAllPosts())
        }
        
      }
      housesFetch()
      return () => {
        
      }
    }, [])
    


    const ImageCarouselContent = [
        {
            imageSource:"https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
            text:"House1 самый лучший"
        },
        {
            imageSource:"https://www.houseplans.net/uploads/styles/54-original.jpg",
            text:"House2 супер элегантный"
        },
        {
            imageSource:"https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
            text:"House3 покажет ваш характер"
        },
        {
            imageSource:"https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
            text:"House1 самый лучший"
        },
        {
            imageSource:"https://www.houseplans.net/uploads/styles/54-original.jpg",
            text:"House2 супер элегантный"
        },
        {
            imageSource:"https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
            text:"House3 покажет ваш характер"
        }
    ]

    const ServicesContent = [
        {
            text:"Сопровождение сделки",
            subtext:"Наши юристы позаботятся о вашей безопасности"
        },
        {
            text:"Оценка недвижимости",
            subtext:"Бесплатно узнайте рыночную стоимость "
        },
        {
            text:"Ипотечный калькулятор",
            subtext:"Подберите удобный ежемесячный платеж",
          //  marginTop:8
        },
        {
            text:"Страхование",
            subtext:"Защитите имущество",
           // marginTop:8
        }
    ]

    const SearchButtonsContent = [
        {
            text:"Новый поиск"
        },
        {
            text:"Мои поиски"
        },
        {
            text:"Выбрать риэлтора"
        }
    ]
        
    

  return (
    <SafeAreaView style={styles.container}>
    {/* <StatusBar barStyle='dark-content' /> */}
       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent:'center', alignItems:'center'}} style={styles.scrollView}>
            <View style={styles.content}> 
            <HeaderComponent />
                <FlatList
                    data={ImageCarouselContent}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => 
                    <View style={styles.storyItem}>
                        <Text style={styles.storyItemText}>{item.text}</Text>
                    </View>}
                />
            <View style={{marginHorizontal: 8}}>
              <Text style={styles.functionTitleText}>
                  Сервисы
              </Text>
            </View>

                <View style={styles.functionCards}>
                    {
                        ServicesContent.map((item, index) => (
                            //<Pressable style={[styles.functionCard, item.marginTop && {marginTop:item.marginTop}]} key={index}>
                            <Pressable style={styles.functionCard} key={index}>
                                <View style={[styles.functionCardView]}>
                                    <Text style={styles.functionCardText}>
                                        {item.text}
                                    </Text>
                                    <Text style={styles.functionCardSubText}>
                                        {item.subtext}
                                    </Text>
                                </View>
                            </Pressable>

                        ))
                    }
                    <Pressable style={{width:width-16, backgroundColor: "#FFF", borderRadius: 16, marginTop: 4 }}>
                        <View style={styles.functionCardView}>
                            <Text style={styles.functionCardText}>
                                Все сервисы
                            </Text>
                            <Ionicons style={{alignSelf:'flex-end'}} name="arrow-forward" size={24} color="#32322C" />
                        </View>
                    </Pressable>
                </View>

                <View style={{marginHorizontal: 8, marginTop: 12}}>
              <Text style={styles.functionTitleText}>
                  Найти
              </Text>
            </View>

                <View style={styles.searchButtonsView}>
                    {
                        SearchButtonsContent.map((item, index) => (
                            <Pressable style={styles.searchButtonsContent} key={index}>
                                <Text style={styles.searchButtonsText}>
                                    {item.text}
                                </Text>
                            </Pressable>
                        ))
                    }
                </View>

                <Text style={styles.housesTitleText}>
                    Дома
                </Text>

                <View style={styles.housesView}>
                    {
                        Object.keys(houses).length != 0 && houses != undefined ?
                        <FlatList
                        data={houses}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}, index) => 
                        <View style={styles.houseItem}>
                            <View style={styles.houseImageView}>
                               <Image style={styles.houseImage} width={100} height={100} source={{uri:item.photos[0]}}/>
                            </View>
                            <View>
                                <View>
                                    <Text style={styles.houseItemText}>
                                        {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                                    </Text>
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>
                                        {item.bedrooms}-комн.
                                    </Text>
                                    <Text>
                                        {item.house_area} м²
                                    </Text>
                                    <Text>
                                        этажей: {item.num_floors}
                                    </Text>
                                </View>
                            </View>
                            
                        </View>
                        }/>
                        :
                        <ActivityIndicator
                        size={"large"}
                        color={"#32322C"}/>
                        
                    }
                </View>

                <Text style={styles.housesTitleText}>
                    Новостройки
                </Text>

                <View style={styles.housesView}>
                    {
                        Object.keys(houses).length != 0 && houses != undefined ?
                        <FlatList
                        data={houses}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({item}) => 
                        <View style={styles.houseItem}>
                            <View style={styles.houseImageView}>

                            </View>
                            <View>
                                <Text style={styles.houseItemText}>
                                    {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
                                </Text>
                            </View>
                            <View>

                            </View>
                        </View>}
                        />
                        :
                        <ActivityIndicator
                        size={"large"}
                        color={"#32322C"}/>
                    }
                </View>
            </View>
        </ScrollView>
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor:"#F5F5F5"
    },
    content: {
        width:'100%',
        paddingHorizontal:0
    },
    scrollView:{
    
        height:'100%',
        marginTop:16
    },
    storyItem:{
        height:96,
        width:96,
        borderRadius:12,
        backgroundColor:"rgba(50, 50, 44, 0.8)",
        marginLeft: 8,
        alignItems:"center"
    },
    storyItemText:{
        color:"#FFF",
        fontSize:18,
        paddingTop:8
    },
    functionTitleText:{
      fontFamily:'Montserrat700',
      fontSize:28,
      color:"#32322C",
      marginTop:16,
      marginBottom: 8

    },
    functionCards:{
        marginHorizontal: 8,
        flexDirection:"row",
        justifyContent:"space-between",
        flexWrap:'wrap'
    },
    functionCard:{
        borderRadius:16,
        backgroundColor:"#FFF",
        height: (width)/3,
        width: (width-24)/2,
        marginVertical: 4
    },
    functionCardView:{
        paddingHorizontal:8,
        paddingVertical:8,
        flex:1,
        justifyContent:'space-between',
    },
    functionCardText:{
        //fontFamily:'Montserrat700',
        fontSize:20,
        fontWeight: '700'
        //letterSpacing: -0.5
    },
    functionCardSubText:{
        fontFamily:'Montserrat400',
        fontSize:14,
        color:"#717171"
    },
    searchButtonsView:{
        marginHorizontal: 8,
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop: 4
    },
    searchButtonsContent:{
        justifyContent:'flex-start',
        paddingVertical:8,
        paddingHorizontal:8,
        backgroundColor:"rgba(50, 50, 44, 0.8)",
        borderRadius:12,
        width: (width-32)/3
    },
    searchButtonsText:{
        color:"#FFF",
       // fontFamily:"Montserrat700",
       fontWeight:'600',
        fontSize:18
    },
    housesTitleText:{
        fontFamily:'Montserrat700',
        fontSize:20,
        color:"#32322C",
        marginTop:32  
    },
    housesView:{
        marginTop:16,
    },
    houseItem:{
        width:248,
        height:200,
        borderRadius:20,
        backgroundColor:"#FFF",
        marginRight:8
    },
    houseItemText:{
        color:"#32322C",
        fontFamily:"Inter700",
        fontSize:14
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
  });

export default MainPage