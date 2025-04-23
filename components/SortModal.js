import React from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const SortModal = ({ visible, onClose, selectedSort, setSelectedSort, handleFilterChoice }) => {
  const sortOptions = [
    { id: '81', label: 'Дешевле' },
    { id: '82', label: 'Дороже' },
    { id: '83', label: 'Новые' },
    { id: '84', label: 'По площади' },
    { id: '85', label: 'По размеру участка' },
  ];

  const handleSortPress = (option) => {
    setSelectedSort(option);
  };

  const handleApplyPress = () => {
    handleFilterChoice()
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} onPressOut={onClose}>
        <View style={styles.modalContent}>
          <TouchableWithoutFeedback >
            <View >
              <Text style={styles.modalHeader}>Сортировка</Text>
              {sortOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.sortButton,
                    selectedSort.id === option.id && styles.selectedSortButton,
                  ]}
                  onPress={() => handleSortPress(option)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      selectedSort.id === option.id && styles.selectedSortButtonText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
              <Pressable style={styles.closeButton} onPress={() => handleApplyPress()}>
                <Text style={styles.closeButtonText}>Применить</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableOpacity>

    </Modal>
  );
};

export default SortModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32
  },
  modalContent: {
    backgroundColor: 'white',
    width: width - 48,
    borderRadius: 20,
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
