import { ActivityIndicator, Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState, useLayoutEffect} from 'react'
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
import TextInputSearch from '../components/TextInputSearch';


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

    const [selectedList, setSelectedList] = useState('organization');

    const [houses, setHouses] = useState([])
    const { getPaginatedPosts } = useApi()

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [selectedSort, setSelectedSort] = useState({});

    const [selectedCategory, setSelectedCategory] = useState({})
    const [priceRange, setPriceRange] = useState([])
    const [areaRange, setAreaRange] = useState([])
    const [zeroRows, setZeroRows] = useState(false)

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
      console.log("First UseEffect!");
      
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
      console.log("Second UseEffect!");
      
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (Object.keys(houses).length === 0) {
        const loadFromAPI = async () => {
          try {
            const response = await getPaginatedPosts(page, queryObject);
            // Убедимся, что `response` является массивом
            if (response[1] == 0) {
              setHouses([])
              setZeroRows(true)
            } else {
              setHouses(Array.isArray(response[0]) ? response[0] : []);
            }
            
          } catch (error) {
            console.error("Error fetching posts:", error);
            setHouses([]); // Устанавливаем пустой массив при ошибке
          }
        };
        loadFromAPI();
      }
    }, []);

    const handleFilterChoice = async () => {
      console.log("FilterChoice!");
      
      const response = await getPaginatedPosts(page, queryObject)
      setHouses(Array.isArray(response[0]) ? response[0] : []);
      if (response[1] == 0) {
        setZeroRows(true)
      }
    }

    const loadMoreData = async () => {
      console.log("Loading new page!");
      
      const nextPage = page + 1;
      try {
        const response = await getPaginatedPosts(nextPage, queryObject);

        setPage(nextPage);
        setHouses((prev) => [...prev, ...(response[0] || [])]);
        
      } catch (error) {
        console.error('Error loading more data:', error);
      }
    };

    const clearFilters = async () => {
      setAreaRange([])
      setPriceRange([])
      setSelectedCategory({})
      setSelectedFilters({})
      setQueryObject({})

      try {
        const response = await getPaginatedPosts(1);

        setHouses(Array.isArray(response[0]) ? response[0] : []);
      } catch (error) {
        if (error) {
          throw(error)
        }
      }
    }
 // Обновление кнопки в хедере
 useLayoutEffect(() => {
  navigation.setOptions({
    headerShadowVisible: false, // Убирает тень и линию
    headerLeft: () => (
      <View style={{flexDirection: 'row'}}> 
      <Pressable onPress={() => navigation.navigate('SearchMap')}>
        <Text style={{fontSize: 20, lineHeight: 25, color:"#007AFF", letterSpacing: -0.43, marginLeft: 20}}>Поиск по карте</Text>   
      </Pressable>
      </View>
    ),
    headerRight: () => (
      <View style={{flexDirection: 'row', marginRight: 20}}> 
          <Pressable style={{backgroundColor:"grey"}} onPress={()=>{clearFilters()}}>
            <Text style={{color:"white"}}>Сбросить</Text>
          </Pressable>
          <Pressable style={styles.searchButton} onPress={() => setSortModalVisible(true)}>
            <MaterialIcons name="sort" size={24} color="#007AFF" />
          </Pressable> 
          <Pressable style={styles.searchButton} onPress={() => setModalVisible(true)}>
            <AntDesign name="filter" size={24} color="#007AFF" />
          </Pressable>
      </View>
    ),
  });
}, [navigation])
    
  return (
    <View style={styles.container}>
      <View style={{height: 8}} />
        <View> 
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

          <View style={styles.housesView}>
              
            {houses.length ? (
              <FlatList
              data={houses}
              renderItem={({ item }) => (
                <HouseCard item={item} navigation={navigation} itemWidth={width - 32} />
              )}
              keyExtractor={(item) => item.id.toString()}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              />
              ) : zeroRows 
                ? 
                <Text>Не нашлось объявления которое подходит под Ваш запрос :(</Text>
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
    </View>
  )
}

export default DynamicHousesPage

const styles = StyleSheet.create({

  
  container:{
      flex:1,
      backgroundColor:'#fff',
      alignItems:'center'
  },

  filterContainer: {
    flexDirection: 'row',
    width: width-32,
    justifyContent:'space-between',
    alignSelf: 'center',
    marginBottom: 16,

  },
        
  housesView:{
    backgroundColor: '#F2F2F7',
    width: width,
    alignItems:'center',
  },

  searchButton:{
    flexDirection: 'row',
    alignItems:'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  searchButtonText:{
    color:'#007AFF',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: '500',
    marginLeft: 8
},

  categoriesContainer:{
    flexDirection: 'row',
    alignItems:'baseline',
    marginBottom: 8
  },

  categoriesButton:{
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12
  },

  categoriesText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#007AFF'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    width: width,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
// Цвет неактивной вкладки
  },
  activeTab: {
    backgroundColor: '#616161', // Цвет активной вкладки
  },
  tabText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  mapButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
  },
  mapButtonText: {
    fontSize: 17,
    color: '#007AFF',

  },

})