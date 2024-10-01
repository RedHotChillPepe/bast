import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import React from 'react'

const MainPage = () => {
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
                <View style={styles.searchBar}>
                    <TextInput placeholderTextColor={"#bfbfbf"}  placeholder='Поиск' style={styles.searchTextInput}/>
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
    }
  });

export default MainPage