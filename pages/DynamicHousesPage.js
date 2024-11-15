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
    id: 'group1',
    title: 'Заголовок 1',
    options: [
      { id: '1', label: 'Кнопка 1' },
      { id: '2', label: 'Кнопка 2' },
      { id: '3', label: 'Кнопка 3' },
    ],
  },
  {
    id: 'group2',
    title: 'Заголовок 2',
    options: [
      { id: '4', label: 'Кнопка 4' },
      { id: '5', label: 'Кнопка 5' },
      { id: '6', label: 'Кнопка 6' },
    ],
  },
  {
    id: 'group3',
    title: 'Заголовок 3',
    options: [
      { id: '7', label: 'Кнопка 7' },
      { id: '8', label: 'Кнопка 8' },
      { id: '9', label: 'Кнопка 9' },
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

    //const {searchPrepopulate} = route.params
    
    // useEffect(() => {
    //   const loadFromAPI = async () => {
    //     setHouses(await getAllPosts())
    //     //console.log(await getAllPosts());
        
    //   }
      
    //   loadFromAPI()
    //   return () => {
        
    //   }
    // }, [])

    useEffect(() => {
      // Проверяем, что массив `houses` пуст, чтобы загрузить данные только один раз
      if (houses.length === 0) {
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

            {houses.length ? (
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