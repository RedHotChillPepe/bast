import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');

const PriceRangeSlider = ({onSliderChange, priceRange}) => {
  
  const handleValuesChange = (values) => {
    priceRange.current = values
    onSliderChange(priceRange.current)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Цена</Text>
      <View style={styles.areaContainer}>
        <Text style={styles.areaText}>От: {priceRange.current[0].toLocaleString()} Р</Text>
        <Text style={styles.areaText}>До: {priceRange.current[1].toLocaleString()} Р</Text>
      </View>

      <MultiSlider
        values={priceRange.current}
        sliderLength={width - 40} // Длина слайдера
        onValuesChange={handleValuesChange}
        min={0} // Минимальное значение
        max={100_000_000} // Максимальное значение
        step={1000} // Шаг изменения
        selectedStyle={{ backgroundColor: '#007AFF' }} // Стиль выделенного участка
        unselectedStyle={{ backgroundColor: '#ddd' }} // Стиль невыделенного участка
        trackStyle={{ height: 6 }} // Толщина трека
        markerStyle={{ height: 24, width: 24, backgroundColor: '#007AFF' }} // Стиль ползунков
      />
    </View>
  );
};

export default PriceRangeSlider;

const styles = StyleSheet.create({
  container: {
  width: width,
  alignItems:'flex-start'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  areaContainer: {
    width: width-32,
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  areaText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
