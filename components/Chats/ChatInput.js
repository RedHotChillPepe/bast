import React from 'react'
import { StyleSheet, Text, TextInput } from 'react-native'
import { useTheme } from '../../context/ThemeContext';

export default function ChatInput({ handleChangeInputText, inputValue, placeholder = "" }) {
    const { theme } = useTheme();
    const styles = makeStyle(theme);

    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            numberOfLines={1}
            placeholderTextColor={theme.colors.caption}
            onChangeText={handleChangeInputText}
        >
            <Text style={styles.input__text}>{inputValue}</Text>
        </TextInput>
    )
}

const makeStyle = (theme) => StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: theme.colors.caption,
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