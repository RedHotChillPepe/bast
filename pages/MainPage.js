import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';
import HouseCard from '../components/HouseCard';
import StoriesComponent from '../components/StoriesComponent';
import ServicesComponent from '../components/ServiciesComponent';
import VillageCard from '../components/VillageCard';
import TextInputSearch from '../components/TextInputSearch';


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
      if (tempHouses) {
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
          <Pressable onPress={() => navigation.navigate('Поиск')}>
            <TextInputSearch />
          </Pressable>
          <View style={{height:28}} />
        <StoriesComponent />
        <View style={{height:28}} />
          <ServicesComponent />
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
    backgroundColor: '#f7f7f7',
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
    backgroundColor: '#858585', // Изменение цвета для активной кнопки
  },
  searchButtonsText: {
    color: '#858585',
    // fontWeight: 'bold',
    fontSize: 16,
  },
  activeButtonsText: {
    color: '#EFEFEF', // Изменение цвета для активной кнопки
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
