import React, { useRef } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RangeSlider from './RangeSlider';


const { width, height } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, selectedFilters, setSelectedFilters, filterGroups, setPriceRange, setAreaRange, handleFilterChoice }) => {
  const priceRange = useRef([1_000_000, 50_000_000]);
  const areaRange = useRef([0, 1_000])

  const handleOptionPress = (group, option) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters[group.id] === option.id) {
        // Если фильтр уже выбран, отключаем его
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[group.id];
        return updatedFilters;
      } else {
        // Иначе включаем фильтр
        return { ...prevFilters, [group.id]: option.id };
      }

    });
  };

  const handlePriceRange = (range) => {
    setPriceRange(range)
  }

  const handleAreaRange = (range) => {
    setAreaRange(range)
  }

  const handleApplyPress = () => {
    handleFilterChoice()
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} onDismiss={onClose}>
      <View activeOpacity={1} style={styles.modalOverlay} onPressOut={onClose}>
        <View >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Параметры поиска</Text>
            <ScrollView contentContainerStyle={styles.groupList}>
              <RangeSlider
                rangeRef={priceRange}
                onSliderChange={handlePriceRange}
                title="Цена:"
                unit="₽"
                min={0}
                max={100_000_000}
                step={1000}
                sliderLength={width - 64}
              />
              <View style={{ height: 24 }} />
              <RangeSlider
                title="Площадь дома:"
                unit="м²"
                rangeRef={areaRange}
                min={0}
                max={1000}
                step={10}
                onSliderChange={handleAreaRange}
              />
              <View style={{ height: 32 }} />
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
                        onPress={() => handleOptionPress(group, option)}
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
            <Pressable style={styles.closeButton} onPress={() => handleApplyPress()}>
              <Text style={styles.closeButtonText}>Применить</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    width,
    height,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F2F2F7',
    flex: 1,
    borderRadius: 12,
    padding: 16,
    paddingBottom: 32,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.26,
    fontWeight: 'bold',
    marginBottom: 36,
    alignSelf: 'center',

  },
  groupList: {

    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  groupContainer: {

    marginBottom: 24,
  },
  groupHeader: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'

  },
  filterButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    borderRadius: 40,
    marginRight: 12,
    marginBottom: 12
  },
  selectedFilterButton: {
    backgroundColor: 'rgba(0, 122, 255, 1)',
  },
  filterButtonText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    color: '#007AFF',
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
