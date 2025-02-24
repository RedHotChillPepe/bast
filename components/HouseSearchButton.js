import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

const {width} = Dimensions.get('window');

const HouseSearchButton = (props) => {
  return (
    <View style={styles.searchContainer}>
        <FontAwesome5 name="home" size={28} color="black" />
        <View>
          <Text style={styles.headline}>Найти{'\n'}дом</Text>
          {/* <Text style={styles.bodyRegular}>3843 предложения</Text> */}
        </View>
        {/* <AntDesign name="filter" size={24} color="black" /> */}
    </View>
  )
}

export default HouseSearchButton

const styles = StyleSheet.create({
    searchContainer: {
        width: (width - 48)/2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingLeft: 12,
        borderRadius: 20,
        borderColor: '#54545630',
        borderWidth: 1,
    },
    headline: {
        paddingLeft: 8,
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: -0.43,
        lineHeight: 22
    },
})