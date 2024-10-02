import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image } from 'react-native'
import React from 'react'
import ImageCarouselComponent from '../components/ImageCarouselComponent.js'

const MainPage = () => {

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
        }
    ]
        
    

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollView}>
            <View>

                <View style={styles.banner}>
                    <Text style={styles.bannerText}>
                        "Что-то Типа Баннера" - Илья Hotchillipepe
                    </Text>
                </View>

                {/* Вероятно в будущем нужно будет вынести в отдельный компонент */}
                <View style={styles.searchBar}>
                    <TextInput placeholderTextColor={"#bfbfbf"}  
                    placeholder='Поиск' 
                    style={styles.searchTextInput}/>
                </View>

                <View style={styles.functionCards}>
                    <Pressable style={styles.functionCard}>
                        <Text>
                            Поиск Дома
                        </Text>
                    </Pressable>

                    <Pressable style={styles.functionCard}>
                        <Text>
                            Работа с Риелтором
                        </Text>
                    </Pressable>

                    <Pressable style={styles.functionCard}>
                        <Text>
                            Создать Объявление
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.imageCarousel}>
                    <ImageCarouselComponent content={ImageCarouselContent}/> 
                </View>

                <View style={styles.newsCards}>
                <Pressable style={styles.newsCard}>
                        <Text>
                            Дома
                        </Text>
                    </Pressable>

                    <Pressable style={styles.functionCard}>
                        <Text>
                            Новые Дома
                        </Text>
                    </Pressable>

                    <Pressable style={styles.functionCard}>
                        <Text>
                            Коттеджные посёлки
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor:"#FFF"
    },
    content: {
        width:'90%',
        marginTop:20
    },
    scrollView:{
        width:"100%",
        height:'100%'
    },
    banner:{
        width:"100%",
        height:90,
        backgroundColor:'#0077FF',
        borderRadius:4
    },
    bannerText:{
        color:"#FFF",
        marginLeft:8,
        marginTop:65
    },
    searchBar:{
        marginTop:15
    },
    searchTextInput:{
        backgroundColor:"#F5F5F5",
        borderRadius:4,
        height:50,
        paddingLeft:8
    },
    functionCards:{
        marginTop:15,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    functionCard:{
        borderRadius:4,
        backgroundColor:"#F5F5F5",
        height:100,
        width:100
    },
    imageCarousel:{
        height:200,
        marginTop:15
    },
    newsCards:{
        marginTop:15,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    newsCard:{
        borderRadius:4,
        backgroundColor:"#F5F5F5",
        height:100,
        width:100
    }
  });

export default MainPage