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
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';
import HouseCard from '../components/HouseCard';
import StoriesComponent from '../components/StoriesComponent';
import ServicesComponent from '../components/ServiciesComponent';
import VillageCard from '../components/VillageCard';
import TextInputSearch from '../components/TextInputSearch';
import HouseSearchButton from '../components/HouseSearchButton';
import AddPostButton from '../components/AddPostButton';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'


const { width } = Dimensions.get('window');
const {height} = Dimensions.get('window');

const MainPage = ({ navigation }) => {
  const { getPaginatedPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [newHouses, setNewHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const selectedList = useRef('houses'); // Новое состояние для выбранного списка

  const [page, setPage] = useState(1)

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getPaginatedPosts(page);      
      
      if (tempHouses[0][0].id != undefined) {
        setHouses(tempHouses[0])
      }
    };

    const villagesFetch = async () => {
      const villageData = await getAllVillages();
      if (villageData) {
        setVillages(villageData);
      }
    };

    housesFetch();
    villagesFetch();
  }, [getPaginatedPosts, getAllVillages]);

  const getMoreData = async (var_page) => {
    if (selectedList !== "villages") {
      
          const tempPage = var_page != undefined ? var_page : (page + 1) 
          

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
    setHouses([]); 
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
          <StoriesComponent />
        
          <View style={{height:16}} />
          
            <ServicesComponent />
          
            <View style={{height:16}} />

              <View flexDirection='row' style={{width: width - 32, alignItems: 'center', alignSelf: 'center'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Поиск')}>
                      <HouseSearchButton readOnly={true}/>
                  </TouchableOpacity>
                <View style={{width: 16}} />
                  <TouchableOpacity onPress={() => navigation.navigate('CreateHousePostPage')}>
                    <AddPostButton /> 
                  </TouchableOpacity>
                </View>
              </View>

            <View style={{height:28}} />

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
      backgroundColor="#fff"
      barStyle='dark-content' /> 
      
        {
          Object.keys(houses).length != 0
          ?
          <OptimizedFlatList
          ListHeaderComponent={<FlatListHeaderComponent/>}
          ListEmptyComponent={<ActivityIndicator size="large" color="#32322C" />}
          data={selectedList.current === "villages" ? villages : houses}
          style={styles.scrollView}
          onEndReached={() => {
            if ( selectedList.current ==="villages") {
              return;
            } else {          
              getMoreData()
            }
            
          }}
          /* onEndReachedThreshold={0.8} */
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
    flex: 1,
    height:height,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  content: {
    width: '100%',
    paddingHorizontal: 0,
  },
  scrollView: {
    paddingTop: 20,
  },
  searchButtonsView: {
    alignSelf:'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    marginTop: 4
  },

  searchButtonsContent: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 12
  },
  activeButton: {
    backgroundColor: '#007AFF', // Изменение цвета для активной кнопки
  },
  searchButtonsText: {
    color: '#007AFF',
    // fontWeight: 'bold',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
  },
  activeButtonsText: {
    color: '#fff', // Изменение цвета для активной кнопки
    fontWeight: '600',
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
