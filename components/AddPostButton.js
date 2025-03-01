import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const HouseSearchButton = (props) => {
  return (
    <View style={styles.searchContainer}>
        <MaterialIcons name="add-home" size={32} color="black" />

        <Text style={styles.headline}>Добавить{'\n'}объявление</Text>
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
        marginLeft: 12,
        fontSize: 17,
        fontWeight: '400',
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