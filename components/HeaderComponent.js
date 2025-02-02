// import React from 'react';
// import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import Octicons from '@expo/vector-icons/Octicons';

// const { width } = Dimensions.get('window');

// export default function HeaderComponent() {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets(); // Получаем отступы безопасной зоны

//   return (
//     <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
//       <View style={styles.headerContent}>
//       <Ionicons name="menu" size={32} color="#fff" />
//         <Text style={styles.headerText}>БАСТ</Text>
//         {/* <Ionicons name="add-circle-outline" size={32} color="#007AFF" onPress={() => navigation.navigate('CreateHousePostPage')}/> */}
//         <Octicons name="search" size={24} color="#007AFF" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   headerContainer: {
//     backgroundColor: '#ffffff',
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     width: width,
//   },
//   headerText: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#14080E',
//   },
//   headerButton: {
//     backgroundColor: '#73AB84',
//     borderRadius: 16,
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerButtonText: {
//     color: '#EFEFEF',
//     fontWeight: 'bold',
//     fontSize: 14,
//     textAlign: 'center',
//     lineHeight: 18, // Улучшает перенос строки
//   },
// });

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

const { width } = Dimensions.get('window');

export default function HeaderComponent() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Состояние для модального окна поиска
  const [modalVisible, setModalVisible] = useState(false);
  // Состояние для текста поиска
  const [searchQuery, setSearchQuery] = useState('');
  // Состояние для результатов поиска (в данном примере – статический массив)
  const [results, setResults] = useState([]);

  // Функция для обработки ввода текста поиска
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Здесь можно реализовать запрос к API или фильтрацию локальных данных.
    // В данном примере создадим фиктивные результаты, если введён хотя бы один символ:
    if (query.length > 0) {
      const dummyResults = [
        { id: 1, name: 'Организация А' },
        { id: 2, name: 'Организация Б' },
        { id: 3, name: 'Организация В' },
      ];
      // Можно отфильтровать dummyResults по запросу:
      const filteredResults = dummyResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  // Рендер одного элемента результата поиска
  const renderResult = ({ item }) => (
    <Pressable style={styles.resultItem} onPress={() => {
      // Например, переходим на профиль выбранной организации или выполняем другую логику
      console.log('Выбран элемент:', item.name);
      setModalVisible(false);
    }}>
      <Text style={styles.resultText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Ionicons
            name="menu"
            size={32}
            color="#fff"
            onPress={() => navigation.openDrawer()} // пример открытия бокового меню
          />
          <Text style={styles.headerText}>БАСТ</Text>
          <Octicons
            name="search"
            size={24}
            color="#007AFF"
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
              onChangeText={handleSearch}
              style={styles.searchInput}
              autoFocus={true}
            />

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
    backgroundColor: '#ffffff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: width,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14080E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
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
