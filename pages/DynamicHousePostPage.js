import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';

const {width} = Dimensions.get('window');

export default function DynamicHousePostPage ({ navigation, route }) {

  const {houseId} = route.params
  const {getPost} = useApi()

  const [postData, setPostData]=useState([])
  
  useEffect(() => {
    const fetchPost = async() => {
      if (houseId) {
        const result = await getPost(houseId)
        const resultJson = JSON.parse(await result.text())
        console.log(resultJson.rows);
        
        setPostData(resultJson.rows[0])
        
      }
    }
    fetchPost()
    return () => {
      
    }
  }, [])
  

return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.mainView}>

      <View style={{width:width-32}}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text>Назад</Text>
        </Pressable>
      </View>   
      

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {
          Object.keys(postData).length == 0
          ?
          <ActivityIndicator size={"large"}
          color={"#32322C"}/>
          :
          postData.photos.map((item, index) =>
          <Image source={{uri:item}} style={styles.image} key={index}/>)
        }

        {/* <Image source={require('../assets/house.png')} style={styles.image} />
        <Image source={require('../assets/house.png')} style={styles.image} />
        <Image source={require('../assets/house.png')} style={styles.image} />
        <Image source={require('../assets/house.png')} style={styles.image} /> */}
      </ScrollView>
      
      {/* priceBlock - блок с ценой и кнопкой Избранное */}
      <View style={styles.priceBlock}>
        {
          Object.keys(postData).length == 0
          ?
          <ActivityIndicator size={"large"}
          color={"#32322C"}/>
          :
          <View>
            <Text style={styles.priceText}>
              {postData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </Text>
            <Text style={styles.priceMeter}>
              {Math.floor(postData.price / postData.house_area).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Р/м²
            </Text>
          </View>
        }
        
        <Text>Изб</Text>
      </View>
      
      {/* specView - основные характеристики */}
      {
        Object.keys(postData).length == 0
        ?
        <ActivityIndicator size={"large"}
        color={"#32322C"}/>
        :
        <View style={styles.specView}>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.bedrooms}-комн.</Text>
            <Text>дом</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.house_area} м²</Text>
            <Text>общая пл.</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.plot_area} сот</Text>
            <Text>участок</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.plot_area} сот</Text>
            <Text>участок</Text>
          </View>
        </View>
      }
      

      {/* adressView - блок с адресом и картой */}
      <View style={styles.adressView}>
        <View >   
          <Text style={styles.adressTitle}>
            Новый город
          </Text>
          <Text style={styles.adressText}>
            Россия, Удмуртская республика, Ижевск, улица имени В.С. Тарасова, 4
          </Text>
        </View> 

        <View style={{alignItems: 'center', marginTop: 8}}> 
          <Image source={require('../assets/adress.png')} style={styles.imageMap} />
        </View>
      </View>

      {/* infoBlock - блок с подробной информацией об объекте */}
      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>
          Об объекте
        </Text>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Тип недвижимости</Text>
          <Text style={styles.infoValue}>ИЖС</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Тип недвижимости</Text>
          <Text style={styles.infoValue}>ИЖС</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Тип недвижимости</Text>
          <Text style={styles.infoValue}>ИЖС</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Тип недвижимости</Text>
          <Text style={styles.infoValue}>ИЖС</Text>
        </View>
      </View>

      {/* actionButtons - кнопки действия НАПИСАТЬ ПОЗВОНИТЬ (надо сделать оверлеем) */}
      <View style={styles.actionBlock}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Написать</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionText}>Позвонить</Text>
        </Pressable>
      </View>


  {/* потом появятся две карусели с домами от этого застройщика и похожими домами */}

      </ScrollView>
  </SafeAreaView>
)

}

const styles = StyleSheet.create({
container: {
    flex: 1,
},

mainView: {
    alignItems:'center'   
},

priceBlock: {
    flexDirection:'row',
    width: width-32,
    justifyContent:'space-between',
    marginTop: 16
},
    
image: {
   width: width*0.8,
   height: width*0.8,
   borderRadius: 12,
   marginVertical: 8,
   marginLeft: 12
},

imageMap: {
    width: width-32,
    height: width*0.34,
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: 12
 },

priceText: {
    fontSize: 24,
    fontWeight:'600'
},

priceMeter: {
    fontSize: 16,
    fontWeight:'400',
    color: 'grey'
},

specView: {
    flexDirection:'row',
    width: width-32,
    justifyContent:'space-between',
    marginTop: 16
},

specElement: {
    alignItems:'center'
},

specText: {
    fontSize: 20,
    fontWeight:'600'
},

adressView: {
    width: width-32,
    marginTop: 32
},

adressTitle: {
    fontSize: 18,
    fontWeight:'600',
    color: 'green',
    marginBottom: 4
},

adressText: {
    color: 'grey'
},

infoBlock: {
    width: width-32,
    marginTop: 32
},

infoTitle: {
    fontSize: 24,
    fontWeight:'600',
    marginBottom: 16
},

infoSpecRow: {
    flexDirection:'row',
    width: width-32,
    justifyContent:'space-between',
    marginBottom: 12
},

infoSpec: {
    fontSize: 16,
    color:'grey'
},

infoValue: {
    fontSize: 16
},

actionBlock: {
    flexDirection:'row',
    width: width-32,
    marginTop: 32,
    justifyContent:'space-between'
},

actionText: {
    fontSize: 24,
    fontWeight:'500',
    color: 'white'
},

actionButton: {
    backgroundColor: 'blue',
    alignItems:'center',
    borderRadius: 16,
    paddingVertical: 16,
    width: (width - 16*2 - 8)/2
},

})