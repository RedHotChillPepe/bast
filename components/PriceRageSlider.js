import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const { width } = Dimensions.get('window');

const PriceRangeSlider = ({onSliderChange, priceRange}) => {

  const handleSliderStop = () => {
    onSliderChange(priceRange.current)
  }
  
  const handleValuesChange = (values) => {
    priceRange.current = values
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Цена:</Text>
      <View style={styles.areaContainer}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.areaText}>От: </Text> 
          <Text style={styles.valueText}>
            {priceRange.current[0].toString()} Р
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.areaText}>
          До: 
          </Text> 
          <Text style={styles.valueText}>
            {priceRange.current[1].toString()} Р
          </Text>
         </View>
      </View>

      <MultiSlider
        style={{marginLeft: 16}}
        values={priceRange.current}
        sliderLength={width - 64} 
        onValuesChange={handleValuesChange}
        onValuesChangeFinish={handleSliderStop}
        min={0} 
        max={100_000_000} 
        step={10000} 
        selectedStyle={{ backgroundColor: '#007AFF' }} 
        unselectedStyle={{ backgroundColor: '#ddd' }} 
        trackStyle={{ height: 6 }} 
        markerStyle={{ height: 24, width: 24, backgroundColor: '#007AFF' }} 
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
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  areaContainer: {
    width: width-64,
    flexDirection: 'row',
    alignItems:'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  areaText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: '400',
  },
  valueText: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.43,
    fontWeight: '600',
  },

});

