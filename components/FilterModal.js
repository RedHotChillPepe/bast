import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, selectedFilters, setSelectedFilters, filterGroups }) => {
  const handleOptionPress = (groupId, optionId) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters[groupId] === optionId) {
        // Если фильтр уже выбран, отключаем его
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[groupId];
        return updatedFilters;
      }
      // Иначе включаем фильтр
      return { ...prevFilters, [groupId]: optionId };
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Выберите фильтры</Text>
          <ScrollView contentContainerStyle={styles.groupList}>
            {filterGroups.map((group) => (
              <View key={group.id} style={styles.groupContainer}>
                <Text style={styles.groupHeader}>{group.title}</Text>
                <View style={styles.optionsContainer}>
                  {group.options.map((option) => (
                    <Pressable
                      key={option.id}
                      style={[
                        styles.filterButton,
                        selectedFilters[group.id] === option.id && styles.selectedFilterButton,
                      ]}
                      onPress={() => handleOptionPress(group.id, option.id)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedFilters[group.id] === option.id && styles.selectedFilterButtonText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width - 48,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  groupList: {},
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  selectedFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
