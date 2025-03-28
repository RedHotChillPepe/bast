import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';

const { width } = Dimensions.get('window');

const HouseSearchButton = (props) => {
  return (
    <View style={styles.searchContainer}>
      <AntDesign name="search1" size={20} color="#2C88EC" />
      <View>
        <Text style={styles.headline}>Поиск дома</Text>
        {/* <Text style={styles.bodyRegular}>3843 предложения</Text> */}
      </View>
      {/* <AntDesign name="filter" size={24} color="black" /> */}
    </View>
  )
}

export default HouseSearchButton

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
  },
  headline: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: -0.43,
    lineHeight: 17.6,
    color: "#3E3E3E",
    fontFamily: "Sora400"
  },
})