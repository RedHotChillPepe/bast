import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import houses from '../assets/testassets/houses.json'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '../context/ApiContext.js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import HouseCard from '../components/HouseCard.js'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FilterModal from '../components/FilterModal.js'
import SortModal from '../components/SortModal.js'


const { width } = Dimensions.get('window');

const filterGroups = [

  {
    id: 'group3',
    title: 'Этажи',
    options: [
      { id: '11', label: '1 этаж' },
      { id: '12', label: '2 этажа' },
      { id: '13', label: '3 этажа' },
    ],
  },
  {
    id: 'group4',
    title: 'Материал несущих стен',
    options: [
      { id: '21', label: 'Кирпич' },
      { id: '23', label: 'Газоблок' },
      { id: '24', label: 'Пенеблок' },
      { id: '25', label: 'Брус' },
      { id: '26', label: 'Доска' },
      { id: '27', label: 'Каркасный' },
    ],
  },
  {
    id: 'group6',
    title: 'Электричество (льготный тариф)',
    options: [
      { id: '31', label: 'Да' },
      { id: '32', label: 'Нет' },
    ],
  },
  {
    id: 'group7',
    title: 'Водоснабжение',
    options: [
      { id: '41', label: 'Центральное' },
      { id: '42', label: 'Скважина' },
    ],
  },
  {
    id: 'group8',
    title: 'Канализация',
    options: [
      { id: '51', label: 'Центральная' },
      { id: '52', label: 'Септик' },
      { id: '53', label: 'Нет' },
    ],
  },
  {
    id: 'group9',
    title: 'Газ',
    options: [
      { id: '61', label: 'Да' },
      { id: '62', label: 'Нет' },
    ],
  },
  {
    id: 'group10',
    title: 'Отопление',
    options: [
      { id: '71', label: 'Котел газовый' },
      { id: '72', label: 'Котел электрический' },
      { id: '73', label: 'Печь' },
      { id: '74', label: 'Нет' },
    ],
  },

];


const categories = [
  { id: '1', label: 'Все' },
  { id: '2', label: 'до 2 млн Р' },
  { id: '3', label: 'до 4 млн Р' },
  { id: '4', label: 'до 6 млн Р' },
  { id: '5', label: 'до 10 млн Р' },
];

const handleCategoryPress = (category) => {
  console.log('Выбрана категория:', category);
};

const categoriesButton = ({ item }) => (
  <Pressable
    style={styles.categoriesButton}
    onPress={() => handleCategoryPress(item.label)}
  >
    <Text style={styles.categoriesText}>{item.label}</Text>
  </Pressable>
);

const DynamicHousesPage = ({route}) => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getAllPosts } = useApi()

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState(null);

    const sortOptions = {
      '1': 'Сначала дешевле',
      '2': 'Сначала дороже',
      '3': 'По актуальности',
      '4': 'По площади',
      '5': 'По размеру участка',
    };

    useEffect(() => {
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (Object.keys(houses).length === 0) {
        const loadFromAPI = async () => {
          try {
            const response = await getAllPosts();
            // Убедимся, что `response` является массивом
            setHouses(Array.isArray(response) ? response : []);
          } catch (error) {
            console.error("Error fetching posts:", error);
            setHouses([]); // Устанавливаем пустой массив при ошибке
          }
        };
        loadFromAPI();
      }
    }, [houses, getAllPosts]); // Зависимость от `houses` и `getAllPosts`
        
    
  return (
    <SafeAreaView style={styles.container}>

      {/* Категории */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={categoriesButton}
        />
      </View>

      {/* Фильтры и сортировка */}
      <View style={styles.filterContainer}>
        <Pressable style={styles.searchButton} onPress={() => setModalVisible(true)}>
          <AntDesign name="filter" size={24} color="black" />
            <Text style={styles.searchButtonText}>Фильтры</Text>
          </Pressable>
          <Pressable style={styles.searchButton} onPress={() => setSortModalVisible(true)}>
            <MaterialIcons name="sort" size={24} color="black" />
            <Text style={styles.searchButtonText}>Сортировка</Text>
        </Pressable> 
      </View>

        <View style={styles.content}>
            <View style={styles.housesView}>

            {Object.keys(houses).length != 0 && houses != undefined ? (
            <HouseCard data={houses} 
                       navigation={navigation} 
                       itemWidth={Dimensions.get('window').width -32} 
                       horizontalScroll={false} />
        ) : (
          <ActivityIndicator size="large" color="#32322C" />
        )}


            </View>  
        </View>



      {/* Модальное окно */}
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        filterGroups={filterGroups}
      />

      {/* Модальное окно сортировки */}
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
      />
      
    </SafeAreaView>
  )
}

export default DynamicHousesPage

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#F5F5F5',
        alignItems:'center'
    },

    filterContainer: {
      flexDirection: 'row',
      width: width-32,
      justifyContent:'space-between',
      marginBottom: 16
    },
        
    housesView:{
        width:width,
        alignItems:'center'   
    },
    searchButton:{
      flexDirection: 'row',
      alignItems:'center',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 12,  
  },
  searchButtonText:{
    color:'black',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
},
categoriesContainer:{
  flexDirection: 'row',
  alignItems:'baseline',
  marginBottom: 8
},
categoriesButton:{
  backgroundColor: 'grey',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  marginLeft: 8
},
categoriesText: {
  fontSize: 16,
  color: 'white'
}

})