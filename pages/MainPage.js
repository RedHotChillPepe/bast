import React, { useEffect, useState } from 'react';
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
  TouchableOpacity
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


const { width } = Dimensions.get('window');

const MainPage = ({ navigation }) => {
  const { getAllPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [newHouses, setNewHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedList, setSelectedList] = useState('houses'); // Новое состояние для выбранного списка

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getAllPosts();
      if (tempHouses[0].id != undefined) {
        const tempSetHouses = [];
        const tempSetNewHouses = [];
        tempHouses.forEach((house) => {
          if (house.newbuild) {
            tempSetNewHouses.push(house);
          } else {
            tempSetHouses.push(house);
          }
        });
        setHouses(tempSetHouses);
        setNewHouses(tempSetNewHouses);
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
  }, []);

  // const SearchButtonsContent = [
  //     {
  //         text:"Для вас",
  //         onPress: () => navigation.navigate("Houses", {searchPrepopulate:{status:true}})
  //     },
  //     {
  //         text:"Дом",
  //         onPress: () => navigation.navigate("Houses", {searchPrepopulate:{status:null}})
  //     },
  //     {
  //         text:"Коттеджный поселок",
  //         onPress: () => navigation.navigate("NotExistPage")
  //     },
  // ]

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

  const renderSelectedList = () => {
    switch (selectedList) {
      case 'houses':
        return houses.length ? (
          houses.map((house) => (
            <HouseCard key={house.id} item={house} navigation={navigation} itemWidth={width - 32} />
          ))
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      case 'newHouses':
        return newHouses.length ? (
          newHouses.map((house) => (
            <HouseCard key={house.id} item={house} navigation={navigation} itemWidth={width - 32} />
          ))
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      case 'villages':
        return villages.length ? (
          <VillageCard villages={villages} />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
      backgroundColor="#fff"
      barStyle='dark-content' /> 
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
        style={styles.scrollView}
      >
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
                onPress={() => setSelectedList(item.value)} // Изменение выбранного списка
                style={[
                  styles.searchButtonsContent,
                  selectedList === item.value && styles.activeButton, // Добавляем стиль для активной кнопки
                ]}
              >
                <Text style={[styles.searchButtonsText, selectedList === item.value && styles.activeButtonsText]}>{item.text}</Text>
              </Pressable>
            ))}
          </View>

          {renderSelectedList()}

        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
