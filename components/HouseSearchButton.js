import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

const {width} = Dimensions.get('window');

const HouseSearchButton = (props) => {
  return (
    <View style={styles.searchContainer}>
        <FontAwesome5 name="home" size={32} color="black" />
        <View>
          <Text style={styles.headline}>Найти дом</Text>
          <Text style={styles.bodyRegular}>3843 предложения</Text>
        </View>
        {/* <AntDesign name="filter" size={24} color="black" /> */}
    </View>
  )
}

export default HouseSearchButton

const styles = StyleSheet.create({
    searchContainer: {
        width: (width -48)/2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#d6d6d6',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
    },
    inputSearchStyle: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10
    },
    headline: {
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: -0.43,
        lineHeight: 22
    },
    bodyRegular: {
        fontSize: 12,
        fontWeight: 'regular',
        letterSpacing: -0.43,
        lineHeight: 22
    }
})