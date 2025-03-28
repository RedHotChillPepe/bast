import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const HouseSearchButton = (props) => {
    return (
        <View style={styles.searchContainer}>
            <AntDesign name="home" size={20} color="#2C88EC" />
            <Text style={styles.headline}>Добавить объявление</Text>
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