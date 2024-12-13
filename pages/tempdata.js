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


  import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApi } from '../context/ApiContext';
import HouseCard from '../components/HouseCard';
import StoriesComponent from '../components/StoriesComponent';
import ServicesComponent from '../components/ServiciesComponent';

const { width } = Dimensions.get('window');

const MainPage = () => {
  const navigation = useNavigation();
  const { getAllPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [newHouses, setNewHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedList, setSelectedList] = useState('houses');

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

  const renderSelectedList = () => {
    switch (selectedList) {
      case 'houses':
        return houses.length ? (
          <FlatList
            data={houses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <HouseCard house={item} navigation={navigation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      case 'newHouses':
        return newHouses.length ? (
          <FlatList
            data={newHouses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <HouseCard house={item} navigation={navigation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      case 'villages':
        return villages.length ? (
          <FlatList
            data={villages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ padding: 8 }}>
                <Text>{item.name}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <ServicesComponent />
            <StoriesComponent />
            <View style={{ marginHorizontal: 8, marginTop: 12 }}>
              <Text style={styles.functionTitleText}>Найти</Text>
            </View>
            <View style={styles.searchButtonsView}>
              {[
                { text: 'Для вас', value: 'houses' },
                { text: 'Дом', value: 'newHouses' },
                { text: 'Коттеджный поселок', value: 'villages' },
              ].map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedList(item.value)}
                  style={[
                    styles.searchButtonsContent,
                    selectedList === item.value && styles.activeButton,
                  ]}
                >
                  <Text style={styles.searchButtonsText}>{item.text}</Text>
                </Pressable>
              ))}
            </View>
          </>
        }
        data={[]}
        ListEmptyComponent={renderSelectedList()} // Добавляем список здесь
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  functionTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14080E',
    marginTop: 16,
    marginBottom: 8,
  },
  searchButtonsView: {
    marginHorizontal: 8,
    flexDirection: 'row',
    marginTop: 4,
    width: width - 32,
  },
  searchButtonsContent: {
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#d6d6d6',
    borderRadius: 12,
    marginRight: 16,
  },
  activeButton: {
    backgroundColor: '#a6a6a6',
  },
  searchButtonsText: {
    color: '#14080E',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MainPage;
