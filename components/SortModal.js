import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const SortModal = ({ visible, onClose, selectedSort, setSelectedSort }) => {
  const sortOptions = [
    { id: '1', label: 'Сначала дешевле' },
    { id: '2', label: 'Сначала дороже' },
    { id: '3', label: 'По актуальности' },
    { id: '4', label: 'По площади' },
    { id: '5', label: 'По размеру участка' },
  ];

  const handleSortPress = (optionId) => {
    setSelectedSort(optionId);

  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Выберите сортировку</Text>
          {sortOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.sortButton,
                selectedSort === option.id && styles.selectedSortButton,
              ]}
              onPress={() => handleSortPress(option.id)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  selectedSort === option.id && styles.selectedSortButtonText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Применить</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;

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
  sortButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSortButtonText: {
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
