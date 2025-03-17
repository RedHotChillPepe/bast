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
      <Text style={styles.header}>Площадь дома:</Text>
      <View style={styles.areaContainer}>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.areaText}>
            От: 
          </Text> 
          <Text style={styles.valueText}>
            {areaRange.current[0].toString()} м2
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
          <Text style={styles.areaText}>
            До: 
          </Text> 
          <Text style={styles.valueText}>
            {areaRange.current[1].toString()} м2
          </Text>
        </View>
      </View>

      <MultiSlider
        values={areaRange.current}
        sliderLength={width - 64} 
        onValuesChange={handleValuesChange}
        min={0} 
        max={1_000} 
        step={10} 
        selectedStyle={{ backgroundColor: '#007AFF' }} 
        unselectedStyle={{ backgroundColor: '#ddd' }} 
        trackStyle={{ height: 6 }} 
        markerStyle={{ height: 24, width: 24, backgroundColor: '#007AFF' }} 
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
