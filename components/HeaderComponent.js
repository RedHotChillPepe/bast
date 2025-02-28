import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { useApi } from '../context/ApiContext';

const { width } = Dimensions.get('window');

export default function HeaderComponent() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {getCompanyByName} = useApi()

  // Состояние для модального окна поиска
  const [modalVisible, setModalVisible] = useState(false);
  // Состояние для текста поиска
  const [searchQuery, setSearchQuery] = useState('');
  // Состояние для результатов поиска (в данном примере – статический массив)
  const [results, setResults] = useState([]);

  const handleText = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = async () => {

    

    if (String(searchQuery).length != 0) {
      
      const result = await getCompanyByName(searchQuery)
      const resultJson = JSON.parse(await result.text())

      
      setResults(resultJson[1])

    }

    
  }

  // Рендер одного элемента результата поиска
  const renderResult = ({ item }) => (
    <Pressable style={styles.resultItem} onPress={() => {navigation.navigate("ProfileCompanyPageView", {CompanyId: item.id})}}>
      <Text style={styles.resultText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          {/* <Ionicons
            name="menu"
            size={32}
            color="#9DC0F6"
            onPress={() => navigation.openDrawer()} // пример открытия бокового меню
          /> */}
          <Text style={styles.headerText}>БАСТ Недвижимость</Text>
          <Octicons
            name="search"
            size={24}
            color="#fff"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>

      {/* Модальное окно поиска */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={styles.modalTitle}>Назад</Text>
          </Pressable>
            <TextInput
              placeholder="Введите название организации..."
              value={searchQuery}
              onChangeText={handleText}
              style={styles.searchInput}
              autoFocus={true}
            />
            
            <Pressable onPress={()=>{handleSubmit()}} style={{backgroundColor:'grey', color:'white', width:100, height:30}}>
              <Text>Поиск</Text>
            </Pressable>

            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderResult}
              style={styles.resultsList}
              ListEmptyComponent={
              <Text style={styles.noResultsText}>Нет результатов</Text>
              }
            />

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#9DC0F6',
    // paddingBottom: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: width,
  },
  headerText: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    width: '100%',
    height: '95%',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  resultsList: {
    flexGrow: 0,
    marginBottom: 12,
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#999',
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
