import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native"

const { width } = Dimensions.get("window");

export const Selectors = (props) => {
    const { handleSelected, selectedList, listSelector } = props;


    return (
        <View style={styles.searchButtonsView}>
            {listSelector.map((item) => (
                <Pressable
                    key={`Selector-${item.id}`}
                    onPress={() => handleSelected(item.value)}
                    style={[selectedList === item.value && styles.activeButton, styles.searchButtonsContent]}>
                    <Text numberOfLines={1} style={[selectedList === item.value ? styles.activeButtonsText : styles.searchButtonsText]}>{item.title}</Text>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    searchButtonsView: {
        flexDirection: "row",
        width: width - 32,
        borderRadius: 16,
        padding: 4,
        backgroundColor: "#F2F2F7",
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "space-between",
    },
    searchButtonsContent: {
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1
    },
    activeButton: {
        backgroundColor: '#2C88EC',
        borderRadius: 12,
    },
    searchButtonsText: {
        color: "#2C88EC",
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.43,
        textAlign: "center",
        fontFamily: "Sora400"
    },
    activeButtonsText: {
        lineHeight: 17.6,
        fontWeight: "600",
        color: "#F2F2F7",
        fontFamily: "Sora700",
        textAlign: "center",
        fontSize: 14,
    },
})