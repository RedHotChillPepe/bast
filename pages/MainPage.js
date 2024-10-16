import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, FlatList } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const MainPage = () => {
    const navigation = useNavigation()

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
            text:"Страхование",
            subtext:"Подберите удобный ежемесячный платеж"
        },
        {
            text:"Страхование",
            subtext:"Подберите удобный ежемесячный платеж",
            marginTop:8
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
      
        <ScrollView contentContainerStyle={{justifyContent:'center', alignItems:'center'}} style={styles.scrollView}>
            <View style={styles.content}>

                <FlatList
                    data={ImageCarouselContent}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item}) => 
                    <View style={styles.storyItem}>
                        <Text style={styles.storyItemText}>{item.text}</Text>
                    </View>}
                />

                <Text style={styles.functionTitleText}>
                    Сервисы
                </Text>

                <View style={styles.functionCards}>
                    {
                        ServicesContent.map((item, index) => (
                            <Pressable style={[styles.functionCard, item.marginTop && {marginTop:item.marginTop}]} key={index}>
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
                    <Pressable style={[styles.functionCard, {marginRight:140, marginTop:8,}]}>
                        <View style={styles.functionCardView}>
                            <Text style={styles.functionCardText}>
                                Все сервисы
                            </Text>
                            <Ionicons style={{alignSelf:'flex-end'}} name="arrow-forward" size={24} color="#32322C" />
                        </View>
                    </Pressable>
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
        paddingHorizontal:9,
        paddingTop:16
    },
    scrollView:{
        width:"100%",
        height:'100%',
        marginTop:16
    },
    storyItem:{
        height:84,
        width:84,
        borderRadius:12,
        backgroundColor:"rgba(50, 50, 44, 0.8)",
        marginRight:8,
        alignItems:"center"
    },
    storyItemText:{
        color:"#FFF",
        //fontWeight:"700",
        fontFamily:"Montserrat700",
        fontSize:18,
        paddingTop:8
    },
    functionTitleText:{
      fontFamily:'Montserrat700',
      fontSize:20,
      color:"#32322C",
      marginTop:24  
    },
    functionCards:{
        marginTop:16,
        flexDirection:"row",
        justifyContent:"space-between",
        //justifyContent:"space-between",
        flexWrap:'wrap'
    },
    functionCard:{
        borderRadius:12,
        backgroundColor:"#FFF",
        height:120,
        width:120
    },
    functionCardView:{
        paddingHorizontal:8,
        paddingVertical:8,
        flex:1,
        justifyContent:'space-between',
    },
    functionCardText:{
        fontFamily:'Montserrat700',
        fontSize:12,
        letterSpacing:-0.5
    },
    functionCardSubText:{
        fontFamily:'Montserrat400',
        fontSize:10,
        color:"#717171"
    },
    searchButtonsView:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:12
    },
    searchButtonsContent:{
        paddingHorizontal:8,
        paddingVertical:10,
        backgroundColor:"rgba(50, 50, 44, 0.8)",
        borderRadius:12,
        height:64,
        width:120
    },
    searchButtonsText:{
        color:"#FFF",
        fontFamily:"Montserrat700",
        fontSize:18
    }
  });

export default MainPage