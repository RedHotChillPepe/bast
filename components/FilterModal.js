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
import PriceRangeSlider from './PriceRageSlider';
import AreaRangeSlider from './AreaRageSlider';

const { width, height } = Dimensions.get('window');

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
          <Text style={styles.modalHeader}>Параметры поиска</Text>
          <ScrollView contentContainerStyle={styles.groupList}>
            <PriceRangeSlider />
            <AreaRangeSlider />
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
            <Text style={styles.closeButtonText}>Применить</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: width,
    borderRadius: 12,
    padding: 16,
    paddingBottom: 32,
    maxHeight: '90%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 36,
    alignSelf: 'center',

  },
  groupList: {},
  groupContainer: {
    marginBottom: 24,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap:'wrap'
    
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12
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
