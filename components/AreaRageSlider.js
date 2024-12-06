import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');

const AreaRangeSlider = ({onSliderChange, areaRange}) => {
  

  const handleValuesChange = (values) => {
    areaRange.current = values
    onSliderChange(areaRange.current)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Площадь дома</Text>
      <View style={styles.areaContainer}>
        <Text style={styles.areaText}>От: {areaRange.current[0].toLocaleString()} м2</Text>
        <Text style={styles.areaText}>До: {areaRange.current[1].toLocaleString()} м2</Text>
      </View>

      <MultiSlider
        values={areaRange.current}
        sliderLength={width - 40} // Длина слайдера
        onValuesChange={handleValuesChange}
        min={0} // Минимальное значение
        max={1_000} // Максимальное значение
        step={10} // Шаг изменения
        selectedStyle={{ backgroundColor: '#007AFF' }} // Стиль выделенного участка
        unselectedStyle={{ backgroundColor: '#ddd' }} // Стиль невыделенного участка
        trackStyle={{ height: 6 }} // Толщина трека
        markerStyle={{ height: 24, width: 24, backgroundColor: '#007AFF' }} // Стиль ползунков
      />
    </View>
  );
};

export default AreaRangeSlider;

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
