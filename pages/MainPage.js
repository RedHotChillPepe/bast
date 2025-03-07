import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';
import HouseCard from '../components/HouseCard';
import StoriesComponent from '../components/StoriesComponent';
import ServicesComponent from '../components/ServiciesComponent';
import VillageCard from '../components/VillageCard';
import TextInputSearch from '../components/TextInputSearch';
import HouseSearchButton from '../components/HouseSearchButton';
import AddPostButton from '../components/AddPostButton';


const { width } = Dimensions.get('window');
const {height} = Dimensions.get('window');

const MainPage = ({ navigation }) => {
  const { getPaginatedPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [newHouses, setNewHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const isFocused = useIsFocused()
  const selectedList = useRef('houses'); // Новое состояние для выбранного списка

  const [page, setPage] = useState(1)

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getPaginatedPosts(page);      
      
      if (tempHouses[0][0].id != undefined) {
        setHouses([])
        setHouses(tempHouses[0])
        setIsLoaded(true)
      }
    };

    const villagesFetch = async () => {
      const villageData = await getAllVillages();
      if (villageData) {
        setVillages([])
        setVillages(villageData);
      }
    };

    housesFetch();
    villagesFetch();
  }, [getPaginatedPosts, getAllVillages, isFocused]);

  const getMoreData = async (var_page) => {
    if (selectedList !== "villages") {
      
          const tempPage = var_page != undefined ? var_page : (page + 1) 
       
          if (var_page == 1) {
            setHouses([])
          }

          try {
            setPage(tempPage)
            console.log("temppage: ", tempPage);
            
            const result = await getPaginatedPosts(tempPage)
            if (Object.keys(houses).length == 0) {
              setHouses(await result[0])
            } else {
              setHouses((prev) => [...prev, ...( result[0])]);
            }
            
          } catch (error) {
            if (error) {
              throw(error)
            }
          
          }
    }
  
  }

  const handleSearchButton = async (value) => {
    selectedList.current = value
    
    getMoreData(1);
    
    
  }

  const SearchButtonsContent = [
    {
      text: 'Для вас',
      value: 'houses',
    },
    {
      text: 'Дома',
      value: 'newHouses',
    },
    {
      text: 'Коттеджные поселки',
      value: 'villages',
    },
  ];


  const FlatListHeaderComponent = () => {
    return (
      <View>
        <View style={styles.content}>
          {/* <StoriesComponent /> */}
        
          {/* <View style={{height:16}} /> */}
          
            <ServicesComponent />
          
            <View style={{height:16}} />

              <View flexDirection='row' style={{width: width - 32, alignItems: 'center', alignSelf: 'center'}}>
                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Поиск')}>
                      <HouseSearchButton readOnly={true}/>
                  </TouchableOpacity>
                <View style={{width: 16}} />
                  <TouchableOpacity onPress={() => navigation.navigate('CreateHousePostPage')}>
                    <AddPostButton /> 
                  </TouchableOpacity>
                </View>
              </View>

            <View style={{height:24}} />

            <View style={styles.searchButtonsView}>
              {SearchButtonsContent.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => {handleSearchButton(item.value)} } // Изменение выбранного списка
                  style={[
                    styles.searchButtonsContent,
                    selectedList.current === item.value && styles.activeButton, // Добавляем стиль для активной кнопки
                  ]}
                >
                  <Text style={[styles.searchButtonsText, selectedList.current === item.value && styles.activeButtonsText]}>{item.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        <View/>
      </View>
      
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar 
      backgroundColor="#9DC0F6"
      barStyle='light-content' /> 
      
        {
          isLoaded
          ?
          <FlatList
          ListHeaderComponent={FlatListHeaderComponent}
          ListEmptyComponent={<ActivityIndicator size="large" color="#32322C" />}
          data={selectedList.current === "villages" ? villages : houses}
          extraData={selectedList.current}
          style={styles.scrollView}
          ListFooterComponent={<View style={{ height: 256 }} />}
          initialNumToRender={3}
          getItemLayout={(data, index) => (
            {length: 250, offset: 250*index, index}
          )}
          onEndReached={() => {
            if ( selectedList.current ==="villages") {
              return;
            } else {
              if (Object.keys(houses).length == 0) {
                getMoreData(1)
              } else {
                getMoreData()
              }     
              
            }
            
          }}
          onEndReachedThreshold={0.8}
          renderItem={({item, index} ) => (
            
              selectedList.current === "villages" 
              ?
              <VillageCard key={item.id} village={item} />
              :
              <HouseCard key={item.id} item={item} navigation={navigation} itemWidth={width - 32} />
          )}
          />
          :
          <ActivityIndicator size="large" color="#32322C" />
        }
      


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:height,
    alignItems: 'center',
    backgroundColor: '#9DC0F6',
  },
  content: {
    width: '100%',
  },
  scrollView: {
    paddingTop: 20,
  },
  searchButtonsView: {
    flexDirection: 'row',
    marginHorizontal: 4,

  },

  searchButtonsContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeButton: {
    // backgroundColor: '#007AFF', // Изменение цвета для активной кнопки
  },
  searchButtonsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.43,
    opacity: 0.6
  },
  activeButtonsText: {
    fontWeight: '600',
    opacity: 1
  },
  housesTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#32322C',
    marginLeft: 8,
    marginTop: 32,
  },
});

export default MainPage;
