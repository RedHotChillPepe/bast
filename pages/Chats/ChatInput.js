import React from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'

export default function ChatInput({ handleChangeInputText, inputValue, placeholder = "" }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            numberOfLines={1}
            onChangeText={handleChangeInputText}
        >
            <Text style={styles.input__text}>{inputValue}</Text>
        </TextInput>
    )
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#808080",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        flex: 1,
    },
    input__text: {
        fontFamily: "Sora400",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 17.6,
        letterSpacing: -0.42,
    }
})