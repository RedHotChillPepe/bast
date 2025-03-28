import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HeaderButton = (props) => {
    const { title, handleButton } = props;
    return (
        <TouchableOpacity
            onPress={handleButton}
        >
            <View style={styles.searchContainer}>
                <AntDesign name="home" size={20} color="#2C88EC" />
                <Text style={styles.headline}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default HeaderButton

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