import React, { useEffect, useRef, useState} from 'react';
import { Text, View, StyleSheet, Pressable, Animated, Platform, Image, Dimensions, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';
import  { YaMap, Marker } from 'react-native-yamap';
import { Geocoder } from 'react-native-yamap';
import Feather from '@expo/vector-icons/Feather';
import ImageCarousel from '../components/ImageCarousel';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const {width} = Dimensions.get('window');

export default function DynamicHousePostPage ({ navigation, route }) {

  const [isInteractingWithMap, setIsInteractingWithMap] = useState(false); // Добавляем состояние


  const {houseId} = route.params
  const {getPost, getIsOwner, getUserByID, updateStatus} = useApi()
  const {getAuth} = useAuth()

  const [postData, setPostData]=useState([])

  const [geoState, setGeoState]=useState({
    lat:0,
    lon:0
  })
  const mapRef = useRef(null)
  
  const [isGeoLoaded, setIsGeoLoaded] = useState(false)

  const [isOwner, setIsOwner]=useState(false)
  const [isFavorite, setIsFavorite]=useState(false)

  const [showModal, setShowModal] = useState(false)
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [phone, setPhone] = useState("")
  const [ownerUser, setOwnerUser] = useState({})

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
    var ownerId = null
    var ownerType = null

    const fetchPost = async() => {
      if (houseId) {
        const result = await getPost(houseId)
        const resultJson = JSON.parse(await result.text())
        console.log(resultJson.rows);
        
        setPostData(resultJson.rows[0])

        ownerId = resultJson.rows[0].poster_id
        ownerType = resultJson.rows[0].poster_type

        var ownerTypeStr = "user"

        switch (ownerType) {
          case 1:
            break;
          case 2:
            ownerTypeStr = "company"
            break;
          case 3:
            ownerTypeStr = "realtor"
          default:
            break;
        }

        const tempUser = await getUserByID(ownerId, ownerTypeStr)
        const tempUserJson = JSON.parse(await tempUser.text())

        setOwnerUser(tempUserJson)
        
        const addressString = resultJson.rows[0].city + " " + resultJson.rows[0].full_address

        if (resultJson.rows[0].latitude == null || resultJson.rows[0].longitude == null) {
          Geocoder.addressToGeo(addressString)
          .then(({lat, lon}) => {
            console.log("lat: ", lat, "lon", lon);
            
            setGeoState({lat:lat, lon:lon})
          })
          .finally(
            setIsGeoLoaded(true)
          )
        } else {
          setGeoState({
            lat:parseFloat(resultJson.rows[0].latitude),
            lon: parseFloat(resultJson.rows[0].longitude) 
          })
          setIsGeoLoaded(true)
          
        }
        
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
      console.log("is favourite: ", isFound);
      
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

  // Обновление кнопки в хедере
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
        <Pressable onPress={toggleFavorite} style={{ marginRight: 16 }}>
          <MaterialIcons
            name={isFavorite ? 'favorite' : 'favorite-border'}
            size={27}
            color={isFavorite ? 'red' : '#007AFF'}
          />
        </Pressable>
        {
          isOwner  
          &&
        <Pressable onPress={() => navigation.navigate("EditHousePostPage", postData)}>
          <Feather name="edit" size={22} color="#007AFF" />     
        </Pressable>
        }
        </View>
      ),
    });
  }, [navigation, isFavorite, isOwner])


  const changeStatus = async (value) => {
    const {post_id, post_status} = value

    const result = await updateStatus({post_id, post_status})
  }
  

return (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer} 
  nestedScrollEnabled={true} // Разрешает вложенный скролл
  keyboardShouldPersistTaps="handled"
  scrollEnabled={!isInteractingWithMap}>

      <ImageCarousel style={{marginLeft: 16}} postData={postData} />
      
      {/* priceBlock - блок с ценой и кнопкой Избранное */}
      <View style={styles.priceBlock}>
        {
          Object.keys(postData).length == 0
          ?
          <ActivityIndicator size={"large"}
          color={"#32322C"}/>
          :
          <View style={{flexDirection:'row', alignItems:'baseline'}}>
            <Text style={styles.priceText}>
              {postData.price != null && postData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
            </Text>
            <View style={{width: 16}} />
            <Text style={styles.priceMeter}>
              {Math.floor(postData.price / postData.house_area).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽/м²
            </Text>
          </View>
        }
        {/* {
          isFavorite 
          ? 
          <Pressable onPress={()=>toggleFavorite()}>
            <MaterialIcons name="favorite" size={32} color="black" />
          </Pressable>  
          :
          <Pressable onPress={()=>toggleFavorite()}>
            <MaterialIcons name="favorite-border" size={32} color="grey" />
          </Pressable> 
        } */}
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
            <Text style={styles.caption1}>дом</Text> 
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.bedrooms}-комн.</Text>
            <Text style={styles.caption1}>планировка</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.house_area} м²</Text>
            <Text style={styles.caption1}>общая</Text>
          </View>
          <View style={styles.specElement}>
            <Text style={styles.specText}>{postData.plot_area} сот</Text>
            <Text style={styles.caption1}>участок</Text>
          </View>
        </View>
      }


      <View style={styles.adressView}>
  

        <View style={{borderRadius: 16, width: width, alignSelf:'center'}}>
          {
            isGeoLoaded 
            ? 
            <View onTouchStart={() => setIsInteractingWithMap(true)} // Блокируем скролл
          onTouchEnd={() => setIsInteractingWithMap(false)} // Разрешаем скролл после взаимодействия
       >
            <YaMap ref={mapRef} style={styles.map}
            onMapLoaded={()=>{mapRef.current.setCenter({ lon:geoState.lon, lat:geoState.lat}, 10)}}
            >
              {/* Добавление круга на карту */}
              <Marker point={{ lat: geoState.lat, lon: geoState.lon }} scale={0.25} source={require('../assets/marker.png')} />
            </YaMap> 
            </View>
            
            : 
            <Text style={{alignSelf:'center'}}>Загрузка Карты...</Text>
          }
        </View>
        <View>   
          <Text style={styles.adressText}>
            {postData.city}, {postData.full_address}
          </Text>
        </View> 
      </View>

      {/* sellerView - блок с продавцом */}    
      <View style={{marginTop: 32, alignSelf:'flex-start', marginLeft: 16}}>
        <Text style={styles.infoTitle}>Продавец</Text>
        {
          Object.keys(ownerUser).length != 0
          &&
          
            <Pressable onPress={()=> {navigation.navigate("ProfilePageView", { posterId: ownerUser[0].id })}}>
              <View style={{flexDirection:'row', alignItems:'flex-start', backgroundColor: '#fff', width: width - 32, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 20}}>
                <FontAwesome6 name="face-meh" size={40} color="black" opacity={0.6} />
                <View style={{width: 12}} />
                <View>
                  <Text style={[styles.serviciesText, {color: '#007AFF'}]}>{ownerUser[0].name} {ownerUser[0].surname}</Text>
                  <Text style={{opacity: 0.6}}>Риэлтор</Text>
                </View>
              </View>
            </Pressable>
          
        }
      </View>


      {/* serviciesBlock - блок с услугами */}
      <View style={styles.serviciesBlock}>
        <Text style={styles.infoTitle}>Услуги</Text>
        <View style={styles.serviciesView}>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate('Errors',{screen:"NotExistPage"})}>
            <Text style={styles.serviciesText}>Страхование</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate('Errors',{screen:"NotExistPage"})}>
            <Text style={styles.serviciesText}>Оценка недвижимости</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate('Errors',{screen:"NotExistPage"})}>
            <Text style={styles.serviciesText}>Trade-in</Text>
          </Pressable>
          <Pressable style={styles.serviciesPressable} onPress= {() => navigation.navigate('Errors',{screen:"NotExistPage"})}>
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
      <View style={{height: 128}} />
      
        {/* потом появятся две карусели с домами от этого застройщика и похожими домами */}

      </ScrollView>

      <View style={styles.buttonContainer}>
  {
    isOwner
      ? (
        <View style={{flexDirection: 'row', width: width - 32, justifyContent: 'space-between'}}>
          <Pressable
            style={[styles.button_1, {backgroundColor: '#FF8680', paddingVertical: 8}]}
            onPress={() => changeStatus({ post_id: houseId, post_status: -1 })}
          >
            <Text style={styles.buttonText}>Удалить</Text>
          </Pressable>
          <Pressable
            style={[styles.button_1, { paddingVertical: 8}]}
            onPress={() => changeStatus({ post_id: houseId, post_status: 3 })}
          >
            <Text style={styles.buttonText}>Закрыть</Text>
          </Pressable>
        </View>
      )
      : (
        <TouchableOpacity onPress={() => handleCallButton()} style={styles.button}>
          <Text style={styles.buttonText}>Позвонить</Text>
        </TouchableOpacity>
      )
  }
</View>


      {
        showModal 
        &&
        <Modal visible={showModal} transparent animationType="slide" onDismiss={()=>setShowModal(false)} onRequestClose={()=>setShowModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

            <View style={{alignItems: 'center'}}>
                {
                  Object.keys(ownerUser).length != 0
                  &&
                  <Pressable onPress={()=> {navigation.navigate("ProfilePageView", { posterId: ownerUser[0].id }); setShowModal(false)}}>
                    <Text style={{fontSize:20, lineHeight: 25, letterSpacing: -0.43, fontWeight: '600', marginBottom: 16, color: '#007AFF'}}>
                      {ownerUser[0].name} {ownerUser[0].surname}
                      </Text>
                  </Pressable>
                }
              </View>

              <View style={{alignItems: 'center'}}>

                
                  {
                    
                    isLoggedIn 
                    ?
                    (
                    <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
                    <Text style={{fontSize: 24}}>
                      {phone}
                      </Text>
                    </Pressable>  
                     ) : (
                    <Text style={{fontSize: 24}}>
                      "Пожалуйста зарегистрируйтесь чтобы посмотреть номер телефона"
                    </Text>
                  )
                  }
                
              </View>

              <Pressable style={styles.closeButton} onPress={()=>setShowModal(false)}>
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </Pressable>
            </View>
          </View>          
        </Modal>
      }
  </View>
)

}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
},

mainView: {
  alignItems: 'center',
},

priceBlock: {
    flexDirection:'row',
    width: width-32,
    justifyContent:'space-between',
    marginTop: 16,
    alignSelf: 'center'
},

imageMap: {
    width: width-32,
    height: width*0.34,
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: 12,
    alignSelf: 'center'
 },

priceText: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.38,
    fontWeight:'bold'
},

priceMeter: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    opacity: 0.7
  
},

scrollContainer: {
  alignItems: 'center',
},

specView: {
    flexDirection:'row',
    width: width-32,
    justifyContent:'space-between',
    marginTop: 16,
    alignSelf: 'center'
},

specElement: {
    alignItems:'center',
},

specText: {
    fontSize: 17,
    letterSpacing: -0.43,
    lineHeight: 22,
    fontWeight:'600'
},

caption1: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    opacity: 0.7
},

adressView: {
    width: width-32,
    marginTop: 24,
    alignSelf: 'center'
},

adressTitle: {
    fontSize: 18,
    fontWeight:'600',
    color: 'green',
    marginBottom: 4
},

adressText: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 22,
    opacity: 0.7
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
    marginBottom: 16
},

infoSpec: {
  width: width*0.4,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
},

infoValue: {
  textAlign:'right',
  width: width*0.4,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    opacity: 0.7,
},

serviciesBlock: {
  width: width-32,
  marginTop: 40,
  alignItems:'flex-start'
},

serviciesView: {
  width: width-32,
  flexDirection:'row',
  flexWrap:'wrap',
  justifyContent:'space-between'
},

serviciesPressable: {
  width: (width-32-16)/2,
  height: width*0.25 ,
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 12,
  marginBottom: 16,
  borderColor: '#54545630',
  borderWidth: 1,
},

serviciesText: {
  fontSize: 17,
  lineHeight: 22,
  letterSpacing: -0.43,
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
  justifyContent: 'space-around',
  backgroundColor: 'white',
  alignItems: 'center',
  width: width
},

button: {
  backgroundColor: '#007AFF',
  paddingVertical: 12,
  width: width - 32,
  borderRadius: 8,
  alignItems: 'center'
},

button_1: {
  backgroundColor: '#007AFF',
  paddingVertical: 12,
  width: (width - 48)/2,
  borderRadius: 8,
  alignItems: 'center'
},

buttonText: {
  color: '#fff',
  fontSize: 17,
  lineHeight: 22,
  letterSpacing: -0.43,
  fontWeight: '400',
  letterSpacing: -0.43,
  lineHeight: 25,
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
  fontSize: 20,
  fontWeight: '600',
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: 'white',
  width: width - 32,
  borderRadius: 16,
  padding: 16,
},

map: {
  width: width,
  height: width*0.6,

},

})