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

const categories = [
  { id: '1', label: 'Все' },
  { id: '2', label: 'до 2 млн Р' },
  { id: '3', label: 'до 4 млн Р' },
  { id: '4', label: 'до 6 млн Р' },
  { id: '5', label: 'до 10 млн Р' },
];

const filterGroups = [
  {
    id: 'num_floors',
    title: 'Этажи',
    options: [
      { id: '11', label: '1 этаж' },
      { id: '12', label: '2 этажа' },
      { id: '13', label: '3 этажа' },
    ],
  },
  {
    id: 'walls_lb',
    title: 'Материал несущих стен',
    options: [
      { id: '21', label: 'Кирпич' },
      { id: '22', label: 'Газоблок' },
      { id: '23', label: 'Пенеблок' },
      { id: '24', label: 'Брус' },
      { id: '25', label: 'Доска' },
      { id: '26', label: 'Каркасный' },
    ],
  },
  {
    id: 'electricity_bill',
    title: 'Электричество (льготный тариф)',
    options: [
      { id: '31', label: 'Да' },
      { id: '32', label: 'Нет' },
    ],
  },
  {
    id: 'water',
    title: 'Водоснабжение',
    options: [
      { id: '41', label: 'Центральное' },
      { id: '42', label: 'Скважина' },
    ],
  },
  {
    id: 'sewage',
    title: 'Канализация',
    options: [
      { id: '51', label: 'Центральная' },
      { id: '52', label: 'Септик' },
      { id: '53', label: 'Нет' },
    ],
  },
  {
    id: 'gas',
    title: 'Газ',
    options: [
      { id: '61', label: 'Да' },
      { id: '62', label: 'Нет' },
    ],
  },
  {
    id: 'heating',
    title: 'Отопление',
    options: [
      { id: '71', label: 'Котел газовый' },
      { id: '72', label: 'Котел электрический' },
      { id: '73', label: 'Печь' },
      { id: '74', label: 'Нет' },
    ],
  },

];

const DynamicHousesPage = ({route}) => {

    const navigation = useNavigation()
    const [houses, setHouses] = useState([])
    const { getPaginatedPosts } = useApi()

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState({});

    const [selectedCategory, setSelectedCategory] = useState({})
    const [priceRange, setPriceRange] = useState([])
    const [areaRange, setAreaRange] = useState([])

    const [queryObject, setQueryObject] = useState({})

    const [page, setPage] = useState(1)

    const handleCategoryPress = (category) => {
      console.log('Выбрана категория:', category);
      setSelectedCategory(category)
      handleFilterChoice()
    };
    
    const categoriesButton = ({ item }) => (
      <Pressable
        style={styles.categoriesButton}
        onPress={() => handleCategoryPress(item)}
      >
        <Text style={styles.categoriesText}>{item.label}</Text>
      </Pressable>
    );

    // Создание объединённого query для поиска
    useEffect(() => {
      const isCateroyEmpty = Object.keys(selectedCategory).length == 0
      const isFiltersEmpty = Object.keys(selectedFilters).length == 0
      const isSortEmpty = Object.keys(selectedSort).length == 0
      const isRangeEmpty = Object.keys(priceRange).length == 0

      if (!isCateroyEmpty || !isFiltersEmpty || !isSortEmpty || !isRangeEmpty) {
        console.log("Something Changed");
        setPage(1)

        const category = selectedCategory.id
        const sort = selectedSort.id
        const filters = JSON.stringify(selectedFilters)
        const LpriceRange = JSON.stringify({low:priceRange[0], high:priceRange[1]}) 
        const LareaRange = JSON.stringify({low:areaRange[0],high:areaRange[1]})

        const query = {category, sort, LpriceRange, LareaRange, filters}
        
        
        setQueryObject(query)
        
        
      }
    
      return () => {
        
      }
    }, [selectedCategory, selectedFilters, selectedSort, priceRange, areaRange])
    

    useEffect(() => {
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (Object.keys(houses).length === 0) {
        const loadFromAPI = async () => {
          try {
            const response = await getPaginatedPosts(page);
            // Убедимся, что `response` является массивом
            setHouses(Array.isArray(response) ? response : []);
          } catch (error) {
            console.error("Error fetching posts:", error);
            setHouses([]); // Устанавливаем пустой массив при ошибке
          }
        };
        loadFromAPI();
      }
    }, [houses, getPaginatedPosts]); // Зависимость от `houses` и `getPaginatedPosts`
    
    const handleReachBottom = async () => {
      const newPage = await getPaginatedPosts(page+1)
      
      
      setPage(page+1)        

      setHouses(houses.concat(await newPage));
    }

    const handleFilterChoice = async () => {
      const response = await getPaginatedPosts(page, queryObject)
      setHouses(Array.isArray(response) ? response : []);
    }
    
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

      {/* Тестовые поля для проверки */}
      {/* <Text>
        {JSON.stringify(priceRange)}
      </Text>
      <Text>
        {JSON.stringify(areaRange)}
      </Text>
      <Text>
        {JSON.stringify(selectedCategory)}
      </Text>
      <Text>
        {JSON.stringify(selectedFilters)}
      </Text>
      <Text>
        {JSON.stringify(selectedSort)}
      </Text> */}

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

          {Object.keys(houses).length != 0 && houses != undefined 
          ? 
            <HouseCard data={houses} 
              navigation={navigation} 
              itemWidth={Dimensions.get('window').width -32} 
              horizontalScroll={false} 
              onEndReached={handleReachBottom}
            />
          : 
            <ActivityIndicator size="large" color="#32322C" />
          }


          </View>  
      </View>



      {/* Модальное окно */}
      <FilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        filterGroups={filterGroups}
        setPriceRange={setPriceRange}
        setAreaRange={setAreaRange}
        handleFilterChoice={handleFilterChoice}
      />

      {/* Модальное окно сортировки */}
      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        handleFilterChoice={handleFilterChoice}
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