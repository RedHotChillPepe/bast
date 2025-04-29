import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from "../../assets/svg/ChevronLeft"

export default function HeaderChat(props) {
    const { handleClose, title, online } = props;

    return <View style={styles.header}>
        <Pressable onPress={handleClose}>
            <ChevronLeft />
        </Pressable>
        <View style={styles.info}>
            <Text style={styles.header__title}>{title}</Text>
            {online && <View style={styles.onlineDot} />} 
        </View>
        <View />
    </View>
}

const styles = StyleSheet.create({
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 16,
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderBottomWidth: 1,
        borderBottomColor: "#A1A1A1"
    },
    header__title: {
        color: "#000",
        fontSize: 16,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 20.17,
        letterSpacing: -0.48,
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
        marginTop: 2,
    },
})
