import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, Animated, TextInput, KeyboardAvoidingView, Platform, Image, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import Yamap, { Marker } from 'react-native-yamap';

const {width} = Dimensions.get('window');

export default function DynamicHousePostPage ({ navigation, route }) {

  const {houseId} = route.params
  const {getPost, getIsOwner, getUserByID} = useApi()
  const {getAuth} = useAuth()

  const [postData, setPostData]=useState([])

  const [isOwner, setIsOwner]=useState(false)
  const [isFavorite, setIsFavorite]=useState(false)

  const [showModal, setShowModal] = useState(false)
  const [phone, setPhone] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const toggleFavorite = async () => {
    if (isFavorite == true) {
      const result = JSON.parse(await SecureStore.getItemAsync("favs"))
      console.log("true result:", result)
      const favIndex = result.indexOf(houseId)
      console.log("true favindex", favIndex);
      
      const newList = result.toSpliced(favIndex, 1)
      console.log("true newlist", newList);
      await SecureStore.setItemAsync("favs", JSON.stringify(newList) )
      setIsFavorite(false)
    } else if (isFavorite == false) {
      const result = JSON.parse(await SecureStore.getItemAsync("favs"))
      console.log("false result", result)
      const newList = result== null ? [houseId] : result.push(houseId) // если result != null, то newList будет равен кол-ву элементов в новом result
      console.log("false", newList);
      await SecureStore.setItemAsync("favs", JSON.stringify(result == null ? newList : result) )
      setIsFavorite(true)
    }
  }
  
  useEffect(() => {
    const fetchPost = async() => {
      if (houseId) {
        const result = await getPost(houseId)
        const resultJson = JSON.parse(await result.text())
        console.log(resultJson.rows);
        
        setPostData(resultJson.rows[0])
        
      }
    }
    const checkUser = async() => {
      if (houseId) {
        const auth = JSON.parse(await getAuth())
        if (auth[0].password) {
          setIsLoggedIn(true)
          const result = await getIsOwner(await auth[0].phone, await auth[0].password, houseId)
          const resultJson = JSON.parse(await result.text())
          setIsOwner(await resultJson.result)
          
        }
        
      }
    }
    const checkFavorite = async()=>{
      const result = JSON.parse(await SecureStore.getItemAsync("favs"))
      console.log(result);
      
      const isFound = result.includes(houseId)
      console.log(isFound);
      
      if (isFound && result != null) {
        setIsFavorite(true)
      }
    }
    checkUser()
    checkFavorite()
    fetchPost()
    return () => {
      
    }
  }, [])

// оверлей кнопки
const [showButtons, setShowButtons] = useState(false);
const scrollY = useRef(new Animated.Value(0)).current;
const prevScrollY = useRef(0);

const handleScroll = Animated.event(
  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
  {
    useNativeDriver: false,
    listener: (event) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      const isScrollingDown = currentOffset > prevScrollY.current;
      
      if (isScrollingDown && !showButtons) {
        setShowButtons(true);
      } else if (!isScrollingDown && showButtons) {
        setShowButtons(false);
      }
      
      prevScrollY.current = currentOffset;
    },
  }
);

const handleCallButton = async () => {
  setShowModal(true)

  const result = await getUserByID(postData.poster_id)
  const resultJson = JSON.parse(await result.text())

  
  setPhone(await resultJson[0].phone)
}

  

return (
  <SafeAreaView style={styles.container}>
    <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={styles.mainView}>

      <View style={{flexDirection:'row', width:width-32, justifyContent:'space-between', alignItems:'center', }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="black" />
        </Pressable>

        {/* кнопка ведет на экран редактирования объявления (по сути экран создания объявления только с заполненными инпутами) */}
        {/* Видна только хозяину объявления */}
        {
          isOwner  
          &&
          <Pressable style={{backgroundColor: 'black',
            alignItems:'center',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12
           }}
            onPress={() => navigation.navigate("EditHousePostPage", postData)}>

            <Text style={{color:'white', fontSize: 18, fontWeight:'bold'}}>Редактировать</Text>
          </Pressable>
        }
        
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
              {postData.price != null && postData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </Text>
            <Text style={styles.priceMeter}>
              {Math.floor(postData.price / postData.house_area).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Р/м²
            </Text>
          </View>
        }
        {
          isFavorite 
          ? 
          <Pressable onPress={()=>toggleFavorite()}>
            <MaterialIcons name="favorite" size={32} color="black" />
          </Pressable>  
          :
          <Pressable onPress={()=>toggleFavorite()}>
            <MaterialIcons name="favorite-border" size={32} color="grey" />
          </Pressable> 
        }
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
            <Text style={styles.specText}>{postData.num_floors}-эт.</Text>
            <Text>этажей</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.bedrooms}-комн.</Text>
            <Text>комнат</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.house_area} м²</Text>
            <Text>общая пл.</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.plot_area} сот</Text>
            <Text>участок</Text>
          </View>
        </View>
      }
      

      <View style={styles.adressView}>
        <View style={{borderRadius: 16}}>
  <Yamap 
    style={styles.map}
    initialRegion={{
      lat: 50,
      lon: 60,
      zoom: 10,
    }}
  >
    {/* Добавление круга на карту */}
    <Marker point={{ lat: 50, lon: 60 }} source={require('../assets/marker.png')} />
  </Yamap>
  </View>

  <View>   
    <Text style={styles.adressTitle}>
      Новый город
    </Text>
    <Text style={styles.adressText}>
      Россия, Удмуртская республика, Ижевск, улица имени В.С. Тарасова, 4
    </Text>
  </View> 

  <View style={{ alignItems: 'center', marginTop: 8 }}> 
    <Image source={require('../assets/adress.png')} style={styles.imageMap} />
  </View>
</View>




      {/* serviciesBlock - блок с услугами */}
      <View style={styles.serviciesBlock}>
        <Text style={styles.infoTitle}>Услуги</Text>
        <View style={styles.serviciesView}>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate("NotExistPage")}>
            <Text style={styles.serviciesText}>Страхование</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate("NotExistPage")}>
            <Text style={styles.serviciesText}>Оценка недвижимости</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate("NotExistPage")}>
            <Text style={styles.serviciesText}>Trade-in</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate("NotExistPage")}>
            <Text style={styles.serviciesText}>Дизайн интерьера</Text>
          </Pressable>
        </View>
      </View>

      {/* infoBlock - блок с подробной информацией об объекте */}
      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>
          Об объекте
        </Text>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Площадь дома</Text>
          <Text style={styles.infoValue}>{postData.house_area} м2</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Этажи</Text>
          <Text style={styles.infoValue}>{postData.num_floors}</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Площадь участка</Text>
          <Text style={styles.infoValue}>{postData.plot_area} сот</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Материал несущих стен</Text>
          <Text style={styles.infoValue}>{postData.walls_lb}</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Материал внутренних стен</Text>
          <Text style={styles.infoValue}>{postData.walls_part}</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Кровля</Text>
          <Text style={styles.infoValue}>{postData.roof}</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Фундамент</Text>
          <Text style={styles.infoValue}>{postData.base}</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Электричество (льготный тариф)</Text>
          <Text style={styles.infoValue}>Да</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Водоснабжение</Text>
          <Text style={styles.infoValue}>Скважина</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Водоотведение</Text>
          <Text style={styles.infoValue}>Септик</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Газ</Text>
          <Text style={styles.infoValue}>Нет</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Отопление</Text>
          <Text style={styles.infoValue}>Газовый котел</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Материал внутренних стен</Text>
          <Text style={styles.infoValue}>Гипсокартон</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Кадастровый номер</Text>
          <Text style={styles.infoValue}>18:26:000000:16741</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Год постройки</Text>
          <Text style={styles.infoValue}>2022</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Количество спален</Text>
          <Text style={styles.infoValue}>2</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Состояние дома</Text>
          <Text style={styles.infoValue}>не требует ремонта</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Тип дома</Text>
          <Text style={styles.infoValue}>ИЖС</Text>
        </View>
        <View style={styles.infoSpecRow}>
          <Text style={styles.infoSpec}>Дополнительно</Text>
          <Text style={styles.infoValue}>Гараж, навес, баня</Text>
        </View>
      </View>
      
      {/*Вид для отступа снизу*/}
      <View style={{height: '5%'}} />
      
        {/* потом появятся две карусели с домами от этого застройщика и похожими домами */}

      </ScrollView>

      {/* оверлей кнопки */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => handleCallButton()} style={styles.button}>
            <Text style={styles.buttonText}>Позвонить</Text>
          </TouchableOpacity>
        </View>


      {
        showModal 
        &&
        <Modal visible={showModal} transparent animationType="slide" onDismiss={()=>setShowModal(false)} onRequestClose={()=>setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text>
                {
                  isLoggedIn 
                  ?
                  phone
                  :
                  "Пожалуйста зарегистрируйтесь чтобы посмотреть номер телефона"
                }
              </Text>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 24}}>
                  +7 912 563 25 90
                </Text>
              </View>
              <Pressable style={styles.closeButton} onPress={()=>setShowModal(false)}>
                <Text style={styles.closeButtonText}>Позвонить</Text>
              </Pressable>

              {/* <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 18, textAlign:'center'}}>
                Пожалуйста, зарегистрируйтесь
                </Text>
              </View>
              <Pressable style={styles.closeButton} onPress={()=>setShowModal(false)}>
                <Text style={styles.closeButtonText}>Зарегистрироваться</Text>
              </Pressable> */}
            </View>
          </View>          
        </Modal>
      }
  </SafeAreaView>
)

}

const styles = StyleSheet.create({
container: {
    flex: 1,
},

mainView: {
    alignItems:'center',
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
    marginBottom: 24
},

infoSpec: {
  width: width*0.4,
    fontSize: 16,
    fontWeight: '400',
    color:'grey'
},

infoValue: {
  textAlign:'right',
  width: width*0.4,
    fontSize: 16,
    fontWeight: '500',
},

serviciesBlock: {
  width: width-32,
  marginTop: 32,
  alignItems:'flex-start'
},

serviciesView: {
  width: width-32,
  flexDirection:'row',
  flexWrap:'wrap',
  justifyContent:'space-between'
},

serviciesPressable: {
  width: (width-32-8)/2,
  height: width*0.25 ,
  backgroundColor: 'grey',
  borderRadius: 16,
  padding: 8,
  marginBottom: 8
},

serviciesText: {
  color:'white',
  fontSize: 16,
  fontWeight:'600'
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
buttonContainer: {
  position: 'absolute',
  bottom: 0,
  paddingVertical: 12,
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: 'white',
  width: width
},

button: {
  backgroundColor: 'grey',
  paddingVertical: 12,
  width: width -64,
  borderRadius: 8,
  alignItems: 'center'
},
buttonText: {
  color: 'white',
  fontSize: 20,
  fontWeight: '600',
},
closeButton: {
  marginTop: 16,
  backgroundColor: 'grey',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignSelf: 'center',
},
closeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: 'white',
  width: width - 48,
  borderRadius: 12,
  padding: 16,
  maxHeight: '80%',
},

map: {
  width: width,
  height: 250,
},

})